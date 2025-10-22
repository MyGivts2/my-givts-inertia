@props(['title', 'slug', 'author', 'date', 'content', 'featured_image'])

<div
    class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
    <a href="{{ route('blogs.show', $slug) }}">
        <img src="{{ 'https://mygivts.nl/storage/' . $featured_image }}" alt="{{ $title }} thumbnail"
            class="h-48 w-full object-cover transition-transform hover:scale-105">
    </a>

    <div class="p-6">
        <a href="{{ route('blogs.show', $slug) }}">
            <h2 class="text-2xl font-semibold text-[#2e1a57] dark:text-white mb-2 hover:underline">{{ $title }}
            </h2>
        </a>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {{ \Carbon\Carbon::parse($date)->format('F j, Y') }}
        </p>
        <div class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {!! html_entity_decode($content) !!}
        </div>

        <a href="{{ route('blogs.show', $slug) }}"
            class="text-sm font-medium text-[#2e1a57] hover:underline dark:text-purple-300">
            Read more →
        </a>
    </div>
</div>
