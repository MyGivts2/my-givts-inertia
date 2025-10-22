<?php

use App\Http\Controllers\ImportController;
use App\Http\Controllers\RecommendationsController;
use App\Http\Controllers\ScraperController;
use App\Models\Blog;
use App\Models\Product;
use App\Models\Prompt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'categories' => Product::distinct()->pluck('category')->map(fn($category) => strtolower($category)),
        'products' => Product::inRandomOrder()->take(12)->get(),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/profile', function () {
    return Inertia::render('profile', [
        'categories' => Product::distinct()->pluck('category')->map(fn($category) => strtolower($category)),
        'products' => Product::inRandomOrder()->take(5)->get(),
    ]);
})->name('profile');

Route::get('/recommendations', function () {
    return Inertia::render('recommendations');
})->name('recommendations');

Route::get('/api', function () {
    return response()->json([
        'products' => Product::all(),

    ]);
})->name('api');

Route::get('/prompt-editor', function () {
    return Inertia::render('prompt-editor', [
        'products' => Product::all(),
        'prompt' => Prompt::first()
    ]);
})->name('prompt-editor');

Route::get('/how-does-it-work', function () {
    return Inertia::render('how-does-it-work');
})->name('how-does-it-work');

Route::post('/prompt-editor', function (Request $request) {
    $prompt = Prompt::first();
    $prompt->update([
        'prompt_text' => $request->input('prompt_text')
    ]);
    return back();
})->name('prompt-editor.update');


Route::prefix('blogs')->group(function () {
    Route::get('/', function () {
        return Inertia::render('blogs', [
            'posts' => Blog::all(),
        ]);
    })->name('blogs');

    Route::post('/', function (Request $request) {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'featured_image' => 'required|image|max:4096',
        ]);
        // Handle the uploaded image
        $imagePath = $request->file('featured_image')->store('blogs', 'public');
        $data['featured_image'] = $imagePath;

        if ($request->has('is_published')) {
            $data['is_published'] = $request->input('is_published');
        } else {
            $data['is_published'] = false;
        }

        Blog::create($data);

        return back()->with('success', 'Blog post created successfully!');
    })->name('blogs.store');

    Route::get('/create', function () {
        return Inertia::render('create-blog');
    })->middleware(['auth', 'admin'])->name('blogs.create');

    Route::get('/{slug}', function ($slug) {
        $post = Blog::where('slug', $slug)->firstOrFail();
        return Inertia::render('blog', [
            'post' => $post,
        ]);
    })->name('blogs.show');

    Route::get('/{slug}/edit', function ($slug) {
        $post = Blog::where('slug', $slug)->firstOrFail();
        return Inertia::render('edit-blog', [
            'post' => $post,
        ]);
    })->middleware(['auth', 'admin'])->name('blogs.edit');

    Route::delete('/{slug}', function ($slug) {
        $post = Blog::where('slug', $slug)->firstOrFail();
        $post->delete();

        return redirect()->route('blogs')->with('success', 'Blog post deleted successfully!');
    })->middleware(['auth', 'admin'])->name('blogs.destroy');

    Route::post('/{slug}', function (Request $request, $slug) {
        $post = Blog::where('slug', $slug)->firstOrFail();
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->store('blogs', 'public');
            $data['featured_image'] = $imagePath;
        }

        $post->update($data);

        return back();
    })->name('blogs.update');
});

Route::get('/product-image/{id}', function (string $id) {
    $product = Product::findOrFail($id);

    // This will return something like "products/1/image.jpg"
    $relativePath = $product->image_path;

    if (!$relativePath || !Storage::disk('local')->exists($relativePath)) {
        abort(404, 'Image not found.');
    }

    return response()->file(
        Storage::disk('local')->path($relativePath)
    );
})->name('scraper');

// create route products group
Route::group(['prefix' => 'products'], function () {
    Route::get('/', function () {
        return Inertia::render('products', [
            'products' => Product::all(),

        ]);
    })->name('products');
});

Route::post('/favorites', function (Request $request) {
    $request->validate([
        'product_id' => 'required|exists:products,id',
    ]);
    $productId = $request->input('product_id');
    /** @var \App\Models\User $user **/
    $user = Auth::user();
    $product = Product::findOrFail($productId);

    // Avoid duplicate favorites
    if (!$user->favorites()->where('product_id', $product->id)->exists()) {
        $user->favorites()->attach($product->id);
    } else {
        $user->favorites()->detach($product->id);
    }
    return back();
})->name('favorites.add');

Route::delete('/favorites', function (Request $request) {
    $request->validate([
        'product_id' => 'required|exists:products,id',
    ]);
    $productId = $request->input('product_id');
    /** @var \App\Models\User $user **/
    $user = Auth::user();
    $user->favorites()->detach($productId);

    return back();
})->name('favorites.remove');

Route::post('/products-import', function (Request $request) {
    (new ImportController())->storeProducts($request);
    return back();
})->name('products.import');

Route::get('/example', function () {
    return Inertia::render('example', [
        'products' => Product::inRandomOrder()->take(5)->get(),
    ]);
})->name('example');

Route::post('/recommendations', [RecommendationsController::class, "index"])->name('recommendations');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
