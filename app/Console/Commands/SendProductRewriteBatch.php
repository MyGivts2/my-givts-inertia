<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use OpenAI;

class SendProductRewriteBatch extends Command
{
    protected $signature = 'openai:rewrite-products';
    protected $description = 'Send BOL.com products to OpenAI for title/description rewriting';

    public function handle()
    {
        $products = Product::where('vendor', 'bol.com')->get();
        $path = storage_path('app/products_batch.jsonl');
        $file = fopen($path, 'w');

        foreach ($products as $product) {
            $prompt = <<<EOT
                Herschrijf de volgende productbeschrijving en titel:

                Titel: {$product->title}
                Productbeschrijving: {$product->description}
                Productid: {$product->id}

                **Vereisten Titel:**
                • Maximaal 5 woorden lang.

                **Vereisten productbeschrijving:**
                • Beschrijving moet neutraal zijn, geen marketing.
                • Ongeveer 3 zinnen lang.
                • In het Nederlands.
                • De productid moet exact worden overgenomen.
            EOT;

            $schema = [
                "name" => "product_rewrite_schema",
                "schema" => [
                    'type' => 'object',
                    'properties' => [
                        'product_id' => [
                            'type' => 'integer',
                            'description' => 'Exact database product ID',
                        ],
                        'rewritten_title' => [
                            'type' => 'string',
                            'description' => 'Herschreven titel van max. 5 woorden',
                        ],
                        'rewritten_description' => [
                            'type' => 'string',
                            'description' => 'Herschreven productbeschrijving in neutraal Nederlands, ~3 zinnen',
                        ],
                    ],
                    'required' => ['product_id', 'rewritten_title', 'rewritten_description'],
                    'additionalProperties' => false,
                ]
            ];

            $line = [
                'custom_id' => "product-{$product->id}",
                'method' => 'POST',
                'url' => '/v1/chat/completions',
                'body' => [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Je bent een product-editor.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'max_tokens' => 500,
                    'response_format' => [
                        'type' => 'json_schema',
                        'json_schema' => $schema,
                    ],
                ],
            ];

            fwrite($file, json_encode($line) . "\n");
        }

        fclose($file);

        $client = OpenAI::client(env('OPENAI_API_KEY'));

        logger("Uploading batch input...");
        $uploaded = $client->files()->upload([
            'file' => fopen($path, 'r'),
            'purpose' => 'batch',
        ]);

        $batch = $client->batches()->create([
            'input_file_id' => $uploaded->id,
            'endpoint' => '/v1/chat/completions',
            'completion_window' => '24h',
            'metadata' => ['type' => 'product-rewrite'],
        ]);

        logger("Batch submitted: {$batch->id}");
    }
}
