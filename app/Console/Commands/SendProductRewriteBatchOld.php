<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use OpenAI;

class SendProductRewriteBatchOld extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'openai:rewrite-products-old';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send BOL.com products to OpenAI for title/description rewriting';

    /**
     * Execute the console command.
     */
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

                Vereisten Titel:
                • Maximaal 5 woorden lang

                Vereisten productbeschrijving:
                • De productbeschrijving moet het product neutraal beschrijven en geen marketing tekst zijn.
                • De productbeschrijving moet ongeveer 3 zinnen lang zijn.
                • De productbeschrijving moet in het Nederlands zijn.
            EOT;

            $line = [
                'custom_id' => "product-{$product->id}",
                'method' => 'POST',
                'url' => '/v1/chat/completions',
                'body' => [
                    'model' => 'gpt-4o-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Je bent een product-editor.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'max_tokens' => 500,
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
