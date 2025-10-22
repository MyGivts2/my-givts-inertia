<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class RefetchImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fetch:images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Images from URLs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $products = Product::all();

        foreach ($products as $product) {
            if ($product->image_name) {
                continue;
            }
            try {
                if (!$product->image_url) {
                    logger("No image URL for product ID: {$product->id}");
                    continue;
                }
                logger("Fetching image for product ID: {$product->id} from URL: {$product->image_url}");
                $imageName = $this->saveImageFromUrl($product->image_url, $product->id);
                $product->update(['image_name' => $imageName]);
            } catch (\Exception $e) {
                logger("Failed to fetch image for product ID: {$product->id}. Error: " . $e->getMessage());
            }
            logger("----------");
        }
    }

    private function saveImageFromUrl($imageUrl, $productId)
    {
        try {
            $response = Http::get($imageUrl);
            logger("Fetching image from URL: $imageUrl");
            logger("Response status for URL $imageUrl: " . $response->status());
            if ($response->successful()) {
                $imageName = basename(parse_url($imageUrl, PHP_URL_PATH)); // Get image name
                $imagePath = "products/{$productId}/" . $imageName; // Store inside product ID folder
                logger($imageName);
                Storage::disk("local")->put($imagePath, $response->body()); // Save image
                logger("Image saved successfully at: $imagePath");
                return $imageName;
            }
        } catch (\Exception $e) {
            logger("Error fetching image from URL: $imageUrl. Error: " . $e->getMessage());
            return null; // Handle failure
        }

        return null;
    }
}
