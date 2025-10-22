<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Prompt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI\Laravel\Facades\OpenAI;

class RecommendationsController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->all();
        $user = [
            'name' => $data['name'],
            'age' => $data['age'],
            'gender' => $data['gender'],
            'budget' => $data['budget'],
            'categories' => $data['categories'],
            // 'occasion' => $data['occasion'],
            // 'relationship' => $data['relationship'],
        ];

        if (isset($data['productIds'])) {
            $bolComProducts = Product::whereIn('category', $user['categories'])
                ->whereNotIn('id', $data['productIds'])
                ->inRandomOrder()
                ->where('vendor', 'bol.com')
                ->limit(7)
                ->get();

            $unknownProducts = Product::whereIn('category', $user['categories'])
                ->whereNotIn('id', $data['productIds'])
                ->inRandomOrder()
                ->where('vendor', 'unknown')
                ->limit(3)
                ->get();
        } else {

            $bolComProducts = Product::whereIn('category', $user['categories'])->inRandomOrder()
                ->where('vendor', 'bol.com')
                ->limit(7)
                ->get();

            $unknownProducts = Product::whereIn('category', $user['categories'])
                ->inRandomOrder()
                ->where('vendor', 'unknown')
                ->limit(3)
                ->get();
        }


        // $categoryProducts = Product::whereIn('category', $user['categories'])->inRandomOrder()
        //     ->limit(50)
        //     ->get();
        // $remainingCount = 100 - $categoryProducts->count();
        // if ($remainingCount > 0) {
        //     $additionalProducts = Product::whereNotIn('id', $categoryProducts->pluck('id'))
        //         ->inRandomOrder()
        //         ->limit($remainingCount)
        //         ->get();

        //     $products = $categoryProducts->merge($additionalProducts);
        // } else {
        //     $products = $categoryProducts;
        // }

        // // Format user profile and product data into a string
        // $userProfile = json_encode($user, JSON_PRETTY_PRINT);
        // $productData = $products->toJson(JSON_PRETTY_PRINT);

        // // Create the full prompt message
        // $prompt = Prompt::first()->prompt_text;
        // $prompt = str_replace("{userProfile}", $userProfile, $prompt);
        // $prompt = str_replace("{productData}", $productData, $prompt);

        // $response = OpenAI::chat()->create([
        //     'model' => 'gpt-4o-mini',
        //     'messages' => [
        //         ['role' => 'system', 'content' => 'You are an gift assistant.'],
        //         ['role' => 'user', 'content' => $prompt],
        //     ],
        //     'response_format' => [
        //         'type' => 'json_schema',
        //         'json_schema' => [
        //             "name" => "gift_recommendations",
        //             "strict" => true,
        //             "schema" => [
        //                 "type" => "object",
        //                 "properties" => [
        //                     "products" => [
        //                         "type" => "array",
        //                         "items" => [
        //                             "type" => "object",
        //                             "properties" => [
        //                                 "explanation" => [
        //                                     "type" => "string"
        //                                 ],
        //                                 "id" => [
        //                                     "type" => "string",
        //                                     "description" => "The ID of the product"
        //                                 ]
        //                             ],
        //                             "required" => [
        //                                 "explanation",
        //                                 "id"
        //                             ],
        //                             "additionalProperties" => false
        //                         ]
        //                     ],
        //                     // "final_answer" => [
        //                     //     "type" => "string"
        //                     // ]
        //                 ],
        //                 "required" => [
        //                     "products",
        //                     // "final_answer"
        //                 ],
        //                 "additionalProperties" => false
        //             ],
        //         ]
        //     ]
        // ]);
        // $data = json_decode($response->choices[0]->message->content);

        // $items = [];
        // foreach ($data->products as $product) {
        //     $model = Product::find($product->id);
        //     if (!$model) {
        //         continue;
        //     }

        //     $items[] = array_merge(
        //         $model->toArray(),
        //         ['explanation' => $product->explanation]
        //     );
        // }
        $items = $bolComProducts->merge($unknownProducts)->shuffle()->values();
        sleep(6);
        return Inertia::render('recommendations', [
            'items' => $items
        ]);
    }
}
