<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckProductImages extends Command
{
    protected $signature = 'products:check-images 
                          {--batch=100 : Number of products to process at once}
                          {--timeout=10 : Request timeout in seconds}';

    protected $description = 'Check if product image URLs are working';

    public function handle()
    {
        $batchSize = $this->option('batch');
        $timeout = $this->option('timeout');

        Log::info('Starting product image URL check', [
            'batch_size' => $batchSize,
            'timeout' => $timeout
        ]);

        $this->info('Starting image URL check...');

        $totalProducts = Product::whereNotNull('image_url')->count();
        $this->info("Found {$totalProducts} products with image URLs");

        Log::info("Found {$totalProducts} products with image URLs to check");

        $bar = $this->output->createProgressBar($totalProducts);
        $bar->start();

        $working = 0;
        $broken = 0;

        Product::whereNotNull('image_url')
            ->chunk($batchSize, function ($products) use (&$working, &$broken, $bar, $timeout) {
                foreach ($products as $product) {
                    try {
                        $response = Http::timeout($timeout)
                            ->head($product->image_url);

                        if ($response->successful()) {
                            // Image URL is working
                            $product->update(['is_image_working' => true]);
                            $working++;

                            Log::debug('Image URL working', [
                                'product_id' => $product->id,
                                'url' => $product->image_url,
                                'status_code' => $response->status()
                            ]);
                        } else {
                            // Image URL returned error status
                            $product->update(['is_image_working' => false]);
                            $broken++;

                            Log::warning('Image URL broken - HTTP error', [
                                'product_id' => $product->id,
                                'url' => $product->image_url,
                                'status_code' => $response->status()
                            ]);

                            $this->newLine();
                            $this->warn("Broken: {$product->id} - {$product->image_url} (Status: {$response->status()})");
                        }
                    } catch (\Exception $e) {
                        // Request failed (timeout, DNS error, etc.)
                        $product->update(['is_image_working' => false]);
                        $broken++;

                        Log::error('Image URL check failed - Exception', [
                            'product_id' => $product->id,
                            'url' => $product->image_url,
                            'error' => $e->getMessage(),
                            'exception' => get_class($e)
                        ]);

                        $this->newLine();
                        $this->error("Failed: {$product->id} - {$product->image_url} ({$e->getMessage()})");
                    }

                    $bar->advance();
                }
            });

        $bar->finish();
        $this->newLine(2);

        $this->info("✓ Check complete!");
        $this->table(
            ['Status', 'Count'],
            [
                ['Working', $working],
                ['Broken', $broken],
                ['Total', $working + $broken]
            ]
        );

        Log::info('Product image URL check completed', [
            'total_checked' => $working + $broken,
            'working' => $working,
            'broken' => $broken,
            'success_rate' => $working + $broken > 0 ? round(($working / ($working + $broken)) * 100, 2) . '%' : '0%'
        ]);

        return 0;
    }
}
