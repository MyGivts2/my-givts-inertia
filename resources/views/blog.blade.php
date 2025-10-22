@extends('layouts.general-layout')

@section('content')
    <section class="max-w-6xl mx-auto px-4">
        <article class="max-w-3xl mx-auto">
            <div class="flex items-center justify-between">
                <a href="/blogs">
                    <button
                        class="text-xs uppercase font-semibold text-[#2e1a57]/50 mb-2 tracking-wider cursor-pointer hover:text-[#2e1a57]/100 duration-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6 mr-1">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                        </svg>

                        Terug naar blogs
                    </button>
                </a>
                @auth
                    @if (auth()->user()->is_admin)
                        <div class="flex gap-2 items-center">
                            <a href="{{ url()->current() . '/edit' }}">
                                <button class="cursor-pointer">
                                    <svg class="text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-pencil-icon lucide-pencil">
                                        <path
                                            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </button>
                            </a>
                            <form action="{{ route('blogs.destroy', $post->slug) }}" method="POST"
                                onsubmit="return confirm('Are you sure?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="cursor-pointer">
                                    <svg class="text-red-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round"
                                        class="lucide lucide-trash-icon lucide-trash">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    @endif
                @endauth
            </div>
            <div class="mb-8">
                <h1 class="text-4xl font-bold mb-4">{{ $post->title }}</h1>
                <div class="flex items-center text-muted-foreground">
                    <div class="flex items-center">
                        {{-- <x-icons.calendar class="h-4 w-4 mr-1" /> --}}
                        {{ \Carbon\Carbon::parse($post->date)->format('F j, Y') }}
                    </div>
                </div>
            </div>

            <div class="aspect-video shadow w-full overflow-hidden rounded-lg mb-8">
                <img src="{{ 'https://mygivts.nl/storage/' . $post->featured_image }}" alt="{{ $post->title }}"
                    class="w-full h-full object-cover" />
            </div>

            <div class="prose prose-lg max-w-none dark:prose-invert">
                {!! $post->content !!}
            </div>
        </article>
    </section>
@endsection
