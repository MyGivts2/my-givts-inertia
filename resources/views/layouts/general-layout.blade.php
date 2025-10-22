<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Welcome' }} | MyGivts</title>

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    {{-- Styles --}}
    @vite(['resources/css/app.css'])
</head>

<body class="flex min-h-screen flex-col bg-[#eae1f3] font-sans antialiased text-gray-800 dark:text-gray-100">

    {{-- Header --}}
    <header class="w-full overflow-hidden rounded-bl-[80px] bg-[#2e1a57] py-12 backdrop-blur">
        <div class="container mx-auto flex flex-col items-center">
            <div class="mb-4 flex w-full items-center justify-center px-4 md:px-6">
                <a href="/" class="flex items-center space-x-2 text-white">
                    <img src="/logo.svg" class="w-7" alt="">
                    <span class="text-xl font-bold">MyGivts</span>
                </a>
            </div>
            <nav class="mx-auto flex flex-1 items-center justify-end rounded-xl bg-white/10 p-1 text-[#eae2f3] sm:p-2">
                @php $current = request()->path(); @endphp

                <a href="/"
                    class="w-24 sm:w-28 rounded-md py-2 text-xs sm:text-sm text-center {{ $current === '/' ? 'bg-[#2e1a57] text-white' : '' }}">Home</a>
                <a href="/profile"
                    class="w-24 sm:w-28 rounded-md py-2 text-xs sm:text-sm text-center {{ $current === 'profile' ? 'bg-[#2e1a57] text-white' : '' }}">Profiel</a>
                <a href="/about-us"
                    class="w-24 sm:w-28 rounded-md py-2 text-xs sm:text-sm text-center {{ $current === 'about-us' ? 'bg-[#2e1a57] text-white' : '' }}">Over
                    Ons</a>
            </nav>
        </div>
    </header>

    {{-- Main Content --}}
    <main class="flex-1">
        <div>
            <section class="rounded-tr-[80px] py-12 md:py-16">
                @yield('content')
            </section>
        </div>
    </main>

    {{-- Footer --}}
    <footer class="py-6 md:py-0 flex">
        <div class="w-full max-w-5xl mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div class="grid gap-1">
                <p class="text-muted-foreground text-center text-sm leading-loose md:text-left">© 2025 MyGivts. Alle
                    rechten voorbehouden.</p>
                <nav
                    class="flex items-center justify-center gap-4 text-xs font-bold text-gray-300 uppercase md:justify-start">
                    <a href="/">Home</a><a class="" href="/profile">Profiel</a><a class=""
                        href="/about-us">Over ons</a><a href="/blogs" class="text-[#2e1a57]">Blogs</a>
                </nav>
            </div>
            <div class="text-muted-foreground flex items-center gap-4">
                <a href="https://www.facebook.com/p/MyGivts-NL-100089637376205/?_rdr" target="_blank">
                    <button data-slot="button"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground size-9 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="h-5 w-5">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg><span class="sr-only">Facebook</span>
                    </button>
                </a>
                <a href="https://www.linkedin.com/company/mygivts/" target="_blank">
                    <button data-slot="button"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground size-9"><svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="h-5 w-5">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z">
                            </path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        <span class="sr-only">LinkedIn</span>
                    </button>
                </a>
                <a href="https://www.instagram.com/mygivtsnl?igsh=MXNzaG5qMGowcjgwMg%3D%3D" target="_blank">
                    <button data-slot="button"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground size-9 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="h-5 w-5">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                        </svg>
                        <span class="sr-only">Instagram</span>
                    </button>
                </a>
                <a href="https://www.tiktok.com/@mygivtsnl?_t=ZN-8u53lLch7Hq&amp;_r=1" target="_blank">
                    <button data-slot="button"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground size-9 cursor-pointer">
                        <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z">
                                </path>
                            </g>
                        </svg>
                        <span class="sr-only">TikTok</span>
                    </button>
                </a>
            </div>
        </div>
    </footer>
</body>

</html>
