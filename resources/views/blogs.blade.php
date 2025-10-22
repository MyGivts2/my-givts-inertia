@extends('layouts.general-layout')

@section('content')
    @if (session('success'))
        <div class="bg-green-100 border max-w-md mx-auto border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('success') }}
        </div>
    @endif
    <section class="max-w-6xl mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8 text-center">Our Latest Blog Posts</h1>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @foreach ($posts as $post)
                <x-blog.card :title="$post['title']" :slug="$post['slug']" :date="$post['date']" :content="$post['content']" :featured_image="$post['featured_image']" />
            @endforeach
        </div>
    </section>
@endsection
