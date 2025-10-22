<?php

namespace App\Console\Commands;

use App\Http\Controllers\AiController;
use App\Http\Controllers\BolApiController;
use App\Http\Controllers\ScraperController;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Probots\Pinecone\Client as Pinecone;
use Illuminate\Support\Str;
use OpenAI;

class TestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting test command...');

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

        $userQuery = 'gift for my boss, classy, under $80, christmas, likes coffee and gadgets';

        $response = $client->responses()->create([
            'model' => 'gpt-4o-mini',
            'input' => [
                [
                    'role' => 'system',
                    'content' => 'You are a data extraction assistant... (use the prompt from section 1)'
                ],
                [
                    'role' => 'user',
                    'content' => $userQuery,
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
        logger($result);

        $this->info('Test command completed.');
    }

    public function testEmbed()
    {
        $client = OpenAI::client(env('OPENAI_API_KEY'));
        $queryEmbedding = $client->embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => "Ik zoek naar een dildo",
            'encoding_format' => 'float',
        ]);
        $pinecone = new Pinecone(
            apiKey: env('PINECONE_API_KEY'),
            indexHost: env('PINECONE_INDEX_HOST') // e.g. https://your-index-xxxx.svc.us-east-1-aws.pinecone.io
        );

        $response = $pinecone->data()->vectors()->query(
            vector: $queryEmbedding['data'][0]['embedding'],
            topK: 20,
            includeMetadata: true,
        );
        logger()->info('Pinecone response: ' . print_r($response->json(), true));
        return $response->json()['matches'] ?? [];
    }
}
