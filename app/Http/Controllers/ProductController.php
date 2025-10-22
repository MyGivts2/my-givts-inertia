<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('products', [
            'products' => Product::all(),

        ]);
    }

    // Save product as favorite
    public function saveProduct($productId)
    {
        /** @var \App\Models\User $user **/
        $user = Auth::user();
        $product = Product::findOrFail($productId);

        // Avoid duplicate favorites
        if (!$user->favorites()->where('product_id', $product->id)->exists()) {
            $user->favorites()->attach($product->id);
        } else {
            $user->favorites()->detach($product->id);
        }
        return redirect()->back();
    }
}
