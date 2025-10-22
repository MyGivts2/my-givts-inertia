<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncShopifyStores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:shopify-stores 
        {store? : Specific store to sync (optional)}
        {--all : Sync all configured stores}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync products from Shopify stores';

    /**
     * Store configurations for different Shopify stores
     */
    protected const STORE_CONFIGS = [
        'dreamunit' => [
            'api_url' => 'https://dreamunit.nl/api/2024-04/graphql.json',
            'token_env' => 'DREAMUNIT_SHOPIFY_TOKEN',
            'category' => 'clothing',
            'vendor' => 'dreamunit',
            'gender' => 'unisex',
        ],
        // Add more stores here as needed
        'after7' => [
            'api_url' => 'https://another-store.com/api/2024-04/graphql.json',
            'token_env' => 'AFTER7_SHOPIFY_TOKEN',
            'category' => 'accessories',
            'vendor' => 'after7',
            'gender' => 'unisex',
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $store = $this->argument('store');
        $syncAll = $this->option('all');

        if ($syncAll) {
            $this->syncAllStores();
        } elseif ($store) {
            $this->syncSpecificStore($store);
        } else {
            $this->showUsage();
        }

        return Command::SUCCESS;
    }

    /**
     * Show command usage
     */
    protected function showUsage(): void
    {
        $this->info('Shopify Store Sync Command');
        $this->line('');
        $this->line('Available stores:');
        foreach (array_keys(self::STORE_CONFIGS) as $store) {
            $this->line("  - {$store}");
        }
        $this->line('');
        $this->line('Usage examples:');
        $this->line('  php artisan sync:shopify-stores dreamunit');
        $this->line('  php artisan sync:shopify-stores --all');
    }

    /**
     * Sync all configured stores
     */
    protected function syncAllStores(): void
    {
        $this->info('Syncing all Shopify stores...');

        foreach (self::STORE_CONFIGS as $storeName => $config) {
            $this->line('');
            $this->info("=== Syncing {$storeName} ===");
            $this->syncStore($storeName, $config);
        }

        $this->line('');
        $this->info('All stores synced successfully!');
    }

    /**
     * Sync specific store
     */
    protected function syncSpecificStore(string $storeName): void
    {
        if (!isset(self::STORE_CONFIGS[$storeName])) {
            $this->error("Store '{$storeName}' not found!");
            $this->line('Available stores: ' . implode(', ', array_keys(self::STORE_CONFIGS)));
            return;
        }

        $config = self::STORE_CONFIGS[$storeName];
        $this->info("Syncing {$storeName}...");
        $this->syncStore($storeName, $config);
    }

    /**
     * Sync products from a specific store
     */
    protected function syncStore(string $storeName, array $config): void
    {
        try {
            $products = $this->fetchProducts($config);
            $this->info("Found " . count($products) . " products");

            $result = $this->syncProducts($products, $config);

            $this->info("✓ {$storeName} sync completed!");
            $this->line("  Created: {$result['created']}");
            $this->line("  Updated: {$result['updated']}");
        } catch (\Exception $e) {
            $this->error("✗ Failed to sync {$storeName}: " . $e->getMessage());
            Log::error("Shopify sync failed for {$storeName}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Fetch products from Shopify GraphQL API
     */
    protected function fetchProducts(array $config): array
    {
        $query = $this->buildQuery();

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Shopify-Storefront-Access-Token' => env($config['token_env'])
        ])->post($config['api_url'], [
            'query' => $query
        ]);

        if ($response->failed()) {
            throw new \Exception('API request failed with status: ' . $response->status());
        }

        $data = $response->json();

        if (isset($data['errors'])) {
            throw new \Exception('GraphQL errors: ' . json_encode($data['errors']));
        }

        if (!isset($data['data']['products']['edges'])) {
            throw new \Exception('Invalid response structure');
        }

        return $data['data']['products']['edges'];
    }

    /**
     * Sync products to database
     */
    protected function syncProducts(array $products, array $config): array
    {
        $created = 0;
        $updated = 0;

        $progressBar = $this->output->createProgressBar(count($products));
        $progressBar->start();

        foreach ($products as $product) {
            $productNode = $product['node'];

            // Get first image URL if available
            $imageUrl = null;
            if (!empty($productNode['media']['edges'])) {
                $firstMedia = $productNode['media']['edges'][0]['node'];
                if ($firstMedia['mediaContentType'] === 'IMAGE' && isset($firstMedia['image']['url'])) {
                    $imageUrl = $firstMedia['image']['url'];
                }
            }

            $productData = [
                'name' => $productNode['title'],
                'description' => $productNode['descriptionHtml'],
                'category' => $config['category'],
                'gender' => $config['gender'],
                'image_url' => $imageUrl,
                'vendor' => $config['vendor'],
            ];

            // Check if product already exists by name and vendor
            $existingProduct = Product::where('name', $productNode['title'])
                ->where('vendor', $config['vendor'])
                ->first();

            if ($existingProduct) {
                // $existingProduct->update($productData);
                $updated++;
            } else {
                Product::create($productData);
                $created++;
            }

            // $progressBar->advance();
        }

        $progressBar->finish();
        $this->line('');

        return ['created' => $created, 'updated' => $updated];
    }

    /**
     * Build GraphQL query
     */
    protected function buildQuery(): string
    {
        return "
            query {
                products(first: 100) {
                    edges {
                        node {
                            id
                            title
                            descriptionHtml
                            media(first: 5) {
                                edges {
                                    node {
                                        mediaContentType
                                        alt
                                        ... on MediaImage {
                                            image {
                                                url
                                                altText
                                            }
                                        }
                                        ... on Video {
                                            sources {
                                                url
                                                mimeType
                                            }
                                        }
                                        ... on ExternalVideo {
                                            embeddedUrl
                                        }
                                        ... on Model3d {
                                            sources {
                                                url
                                                format
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ";
    }
}
