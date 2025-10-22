<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\Product;

class UpdateProductFromBatch extends Command
{
    protected $signature = 'openai:update-products-from-batch 
                            {--file=parsed_batch_output.json : JSON file with parsed AI rewrite output}';

    protected $description = 'Update product titles and descriptions from parsed OpenAI batch JSON output';

    public function handle()
    {
        $file = $this->option('file');

        if (!Storage::exists($file)) {
            $this->error("❌ File not found: storage/app/{$file}");
            return Command::FAILURE;
        }

        $this->info("📂 Reading: storage/app/{$file}");
        $content = Storage::get($file);
        $items = json_decode($content, true);

        if (!is_array($items)) {
            $this->error("⚠️ Failed to parse JSON from {$file}");
            return Command::FAILURE;
        }

        $updated = 0;
        foreach ($items as $key => $data) {
            if (!preg_match('/product-(\d+)/', $key, $matches)) {
                $this->warn("Skipping unrecognized key: {$key}");
                continue;
            }

            $productId = (int) $matches[1];

            $title = $data['rewritten_title'] ?? null;
            $description = $data['rewritten_description'] ?? null;

            if (!$title || !$description) {
                $this->warn("❌ Missing data for product-{$productId}");
                continue;
            }

            $product = Product::find($productId);
            if (!$product) {
                $this->warn("🔍 Product not found: ID {$productId}");
                continue;
            }

            $product->update([
                'title' => $title,
                'description' => $description,
            ]);

            $this->info("✅ Updated product ID {$productId}");
            $updated++;
        }

        $this->info("🎉 Finished updating {$updated} products from batch.");
        return Command::SUCCESS;
    }
}
