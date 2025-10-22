<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ImportController extends Controller
{
    public function storeProducts(Request $request)
    {
        $data = $request->all();

        foreach ($data['products'] as $productData) {
            if (Product::where('name', $productData['name'])->exists()) {
                continue;
            }
            $product = Product::create([
                'name' => $productData['name'],
                'description' => $productData['description'],
                'category' => $productData['category'],
                'product_url' => $productData['url'],
                'price' => $productData['price'],
                'image_name' => null,
                'image_url' => $productData['imageUrl'],
                'gender' => $productData['gender']
            ]);
            $imageName = $this->saveImageFromUrl($productData['imageUrl'], $product->id);
            $product->update(['image_name' => $imageName]);
        }
        return response()->json(['message' => 'Products processed successfully']);
    }

    private function saveImageFromUrl($imageUrl, $productId)
    {
        try {
            $response = Http::get($imageUrl);

            if ($response->successful()) {
                $imageName = basename(parse_url($imageUrl, PHP_URL_PATH)); // Get image name
                $imagePath = "products/{$productId}/" . $imageName; // Store inside product ID folder
                Storage::disk("local")->put($imagePath, $response->body()); // Save image

                return $imageName;
            }
        } catch (\Exception $e) {
            return null; // Handle failure
        }

        return null;
    }
}
