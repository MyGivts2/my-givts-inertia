<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Product;
use Probots\Pinecone\Client as Pinecone;
use Illuminate\Support\Arr;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/products', function (Request $request) {
    $excludeIds = $request->input('products', []);
    logger('Received exclude IDs:');
    logger($excludeIds);
    $products = Product::whereNotIn('id', $excludeIds)
        ->limit(10)
        ->inRandomOrder()
        ->get();
    logger('Fetched products:');
    logger($products->pluck('id'));
    return response()->json([
        'products' => $products,
    ]);
});


Route::post('/search', function (Request $request) {
    $query = $request->input('query');
    logger('Search query: ' . $query);
    $client = OpenAI::client(env('OPENAI_API_KEY'));

    $schema = [
        '$schema' => 'http://json-schema.org/draft-07/schema#',
        'title' => 'GiftSearchExtraction',
        'type' => 'object',
        'additionalProperties' => false,
        'properties' => [
            'age_min' => ['type' => ['integer', 'null'], 'minimum' => 0],
            'age_max' => ['type' => ['integer', 'null'], 'minimum' => 0],
            'max_price' => ['type' => ['integer', 'null'], 'minimum' => 0],
            'currency' => ['type' => ['string', 'null'], 'pattern' => '^[A-Z]{3}$'],
            'recipient' => ['type' => ['string', 'null'], 'maxLength' => 64],
            'occasion' => ['type' => ['string', 'null'], 'maxLength' => 64],
            'interests_keywords' => [
                'type' => 'array',
                'items' => ['type' => 'string', 'maxLength' => 40],
                'maxItems' => 10,
            ],
            'other_context' => ['type' => ['string', 'null'], 'maxLength' => 200],
        ],
        'required' => [
            'age_min',
            'age_max',
            'max_price',
            'currency',
            'recipient',
            'occasion',
            'interests_keywords',
            'other_context'
        ],
    ];

    $response = $client->responses()->create([
        'model' => 'gpt-4o-mini',
        'input' => [
            [
                'role' => 'system',
                'content' => 'You are a data extraction assistant... (use the prompt from section 1) and always return in dutch language.'
            ],
            [
                'role' => 'user',
                'content' => $query,
            ],
        ],
        'text' => [ // ⬅️ NEW: Responses API uses text.format (not response_format)
            'format' => [
                'type' => 'json_schema',
                'name' => 'GiftSearchExtraction',
                'schema' => $schema,

            ],
        ],
    ]);
    $result = json_decode($response->outputText, true);
    $query = buildVectorQuery($result);
    logger('Vector query: ' . $query['text']);
    $productsWithoutBol = queryEmbedding($query, env('PINECONE_INDEX_HOST_NO_BOL'));
    $productsWithBol = queryEmbedding($query, env('PINECONE_INDEX_HOST_BOL'));
    $products = $productsWithoutBol->merge($productsWithBol)->unique('id')->values();

    $products = $products->shuffle()->values();

    return response()->json([
        'products' => $products,
    ]);
})->name('search');


function queryEmbedding($query, $indexHost)
{
    $client = OpenAI::client(env('OPENAI_API_KEY'));
    $queryEmbedding = $client->embeddings()->create([
        'model' => 'text-embedding-3-small',
        'input' => "product search: {$query['text']}. Looking for suitable products matching this description.",
        'encoding_format' => 'float',
    ]);
    $pinecone = new Pinecone(
        apiKey: env('PINECONE_API_KEY'),
        indexHost: $indexHost // e.g. https://your-index-xxxx.svc.us-east-1-aws.pinecone.io
    );
    // @phpstan-ignore-next-line
    $response = $pinecone->data()->vectors()->query(
        vector: $queryEmbedding['data'][0]['embedding'],
        topK: 10,
        includeMetadata: true,
        filter: $query['filter'] ?? [],
    );

    $matches = collect($response->json()['matches'] ?? []);

    // IDs & scores from Pinecone
    $idScore = $matches->map(fn($m) => [
        'id'    => (int) Arr::get($m, 'metadata.product_id', Arr::get($m, 'metadata.id')),
        'score' => (float) ($m['score'] ?? 0),
        'meta'  => $m['metadata'] ?? [],
    ])->filter(fn($x) => $x['id'])->values();

    // Fetch once, key by id
    $products = Product::whereIn('id', $idScore->pluck('id'))->get();

    return $products;
}


function buildVectorQuery(array $x): array
{
    $parts = [];

    // if (!empty($x['recipient']))          $parts[] = "for {$x['recipient']}";
    // if (!empty($x['occasion']))           $parts[] = "occasion {$x['occasion']}";
    if (!empty($x['interests_keywords'])) $parts[] = implode(', ', $x['interests_keywords']);
    if (!empty($x['other_context']))      $parts[] = $x['other_context'];
    if (isset($x['max_price']) && is_int($x['max_price'])) {
        $cur = $x['currency'] ?? 'USD';
        $parts[] = "budget under {$x['max_price']} {$cur}";
    }

    $query = implode(' | ', array_filter($parts));

    // ONLY filter by price if max_price is present (as requested)
    $filter = null;
    if (isset($x['max_price']) && is_int($x['max_price'])) {
        $filter = ['price' => ['$lte' => $x['max_price']]];
    }

    return ['text' => $query, 'filter' => $filter];
}
