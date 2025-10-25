# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyGivts is an AI-powered gift recommendation platform built with Laravel 12, React 19, and Inertia.js. The platform helps users discover personalized gift recommendations based on recipient criteria (age, gender, budget, interests) from a curated product database sourced primarily from Bol.com and other vendors.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 with TypeScript
- **Bridge**: Inertia.js 2.0 (SSR capable)
- **Styling**: Tailwind CSS 4.0 with Radix UI components
- **Database**: SQLite (development), configured via migrations
- **AI Integration**: OpenAI API (via openai-php/laravel) and Pinecone for vector search
- **Authentication**: Laravel Sanctum
- **Routing**: Ziggy for route generation on frontend

## Development Commands

### Starting Development Server

```bash
composer dev
```

This runs four concurrent processes:

- Laravel development server (`php artisan serve`)
- Queue worker (`php artisan queue:listen --tries=1`)
- Log viewer (`php artisan pail --timeout=0`)
- Vite dev server (`npm run dev`)

### Alternative: SSR Development

```bash
composer dev:ssr
```

First builds SSR bundle, then runs server, queue, logs, and Inertia SSR server.

### Frontend Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run build:ssr    # Build with SSR support
npm run lint         # Lint and fix with ESLint
npm run types        # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
```

### Backend Commands

```bash
php artisan serve                    # Start development server
php artisan test                     # Run PHPUnit tests
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed     # Fresh migration with seeding
vendor/bin/pint                      # Format PHP code (Laravel Pint)
php artisan queue:listen --tries=1   # Run queue worker
php artisan pail --timeout=0         # View logs in real-time
```

### Testing

```bash
vendor/bin/phpunit                   # Run all tests
vendor/bin/phpunit tests/Unit        # Run unit tests only
vendor/bin/phpunit tests/Feature     # Run feature tests only
```

## Architecture

### Backend Structure

**Models**:

- `Product`: Core product model with fields: name, description, category, gender, image_url, image_name, product_url, price, vendor
- `User`: Extends Laravel's user model with admin flag and favorites relationship
- `Favorite`: Pivot table for user-product favorites (many-to-many)
- `Blog`: Content management for blog posts with slug-based routing
- `Prompt`: Stores AI prompt templates for recommendations
- `ProductUpdates`: Tracks batch updates from OpenAI processing
- `Tracking`: Analytics/tracking data

**Controllers**:

- `RecommendationsController`: Handles gift recommendation logic. Currently simplified to return filtered products by category and vendor (commented out GPT integration for cost reasons). The full AI flow involves sending user profile + products to GPT-4 with structured JSON schema.
- `ProductController`: Product listing and favorite management
- `BlogController`: Blog CRUD operations with admin middleware
- `ImportController`: Product import utilities
- `ScraperController`: Product scraping from external sources

**Console Commands**:

- `FetchBolProducts`: Downloads and unzips Bol.com product feeds via FTP
- `ImportBolComProducts`: Imports products from feed files
- `RefetchImages`: Re-downloads product images
- `GetBolPrice`: Updates product pricing
- `SendProductRewriteBatch`: Sends products to OpenAI batch API for description rewriting
- `ParseOpenaiBatchResults`: Processes OpenAI batch results
- `CheckProductImages`: Validates product image status
- `UpdateProductFromBatch`: Updates products from batch processing results
- `SyncShopifyStores`: Syncs with Shopify stores

**Key Middleware**:

- `HandleInertiaRequests`: Shares auth user and favorites data to all Inertia pages
- `HandleAppearance`: Manages light/dark theme preferences
- `AdminMiddleware`: Restricts admin-only routes (blog creation/editing)

### Frontend Structure

**Layouts**:

- `app-sidebar-layout.tsx`: Main app layout with collapsible sidebar
- `app-header-layout.tsx`: Alternative header-based layout
- `auth-*-layout.tsx`: Three auth layout variations (split, card, simple)
- `settings/layout.tsx`: Settings pages layout with nested navigation

**Pages** (Inertia.js components in `resources/js/pages/`):

- `welcome.tsx`: Homepage with category filtering and product showcase
- `recommendations.tsx`: Multi-step form for gift criteria, displays AI-recommended products
- `profile.tsx`: User profile with favorites
- `products.tsx`: Product browsing/management
- `blogs.tsx`, `blog.tsx`: Blog listing and individual post pages
- `create-blog.tsx`, `edit-blog.tsx`: Blog editor with Tiptap rich text editor
- `dashboard.tsx`: Authenticated user dashboard
- `auth/*`: Login, register, password reset flows
- `settings/*`: Profile, password, appearance settings
- `analytics.tsx`: Analytics dashboard

**UI Components**:

- Radix UI primitives wrapped in `resources/js/components/ui/`
- Custom components: `app-sidebar`, `nav-main`, `user-menu-content`, `breadcrumbs`
- Form components with react-hook-form + zod validation
- Tiptap editor integration for blog content

**State Management**:

- Inertia shared data for auth state (via `HandleInertiaRequests`)
- Theme management via `use-appearance.tsx` hook (localStorage + cookie sync)
- Form state via react-hook-form

### Data Flow for Recommendations

1. User fills form on `/recommendations` (name, age, gender, budget, categories)
2. POST to `/recommendations` endpoint → `RecommendationsController@index`
3. Controller filters products:
    - 7 products from Bol.com matching categories
    - 3 products from "unknown" vendor
    - Excludes previously shown products if `productIds` provided
4. Returns shuffled results with 6-second artificial delay (simulates AI processing)
5. _Commented out_: Original flow sent user profile + 100 products to GPT-4 with JSON schema for structured recommendations with explanations

### Product Image Handling

Products store images locally in `storage/app/products/{id}/{image_name}`. The `image_path` accessor returns the full path. Route `/product-image/{id}` serves images from private storage.

### Admin Features

Users with `is_admin = true` can:

- Create/edit/delete blog posts
- Access prompt editor at `/prompt-editor`
- Import products via `/products-import`

### Appearance/Theme System

Theme preference stored in:

1. Cookie (`appearance`) for server-side detection
2. localStorage (`theme`) for client-side persistence
3. Applied via `next-themes` provider
4. Synced between client/server via `HandleAppearance` middleware

## Important Patterns

### Inertia.js Usage

- All routes return `Inertia::render('page-name', $data)` instead of views
- Frontend receives props typed in `resources/js/types/index.d.ts`
- Use `route()` helper from Ziggy for type-safe routing: `route('home')`
- Forms use `useForm` from `@inertiajs/react` for seamless SPA-like submissions

### Route Organization

- Web routes: `routes/web.php`
- Auth routes: `routes/auth.php` (included by web.php)
- Settings routes: `routes/settings.php` (included by web.php)
- API routes: `routes/api.php` (Sanctum-protected endpoints)

### Authentication

- Standard Laravel Breeze-style authentication
- Sanctum for API tokens
- Email verification available (`verified` middleware)
- Admin checks via `AdminMiddleware`

### Database

- Uses SQLite in development (`:memory:` for tests)
- Migrations in `database/migrations/`
- No seeders currently active

## External Integrations

- **OpenAI**: Used for product description rewriting and gift recommendations (currently disabled for cost)
- **Pinecone**: Vector database for semantic search (configured but usage unclear from routes)
- **Bol.com FTP**: Product feed downloads via FTP SSL connection
- **Microsoft Clarity**: Analytics tracking (`@microsoft/clarity` package)
- **Puppeteer**: Web scraping for product data

## Notes for AI Work

- **Recommendation Logic**: The AI recommendation feature is currently simplified (see `RecommendationsController.php:140`). The GPT integration code is commented out but preserved for reference. To re-enable, uncomment lines 70-126 and remove the simplified logic.
- **Product Vendors**: Products are tagged with `vendor` field - primarily "bol.com" or "unknown"
- **Image Storage**: All product images stored locally, not CDN. Consider this for performance optimization.
- **Batch Processing**: OpenAI batch API is used for bulk product updates to reduce costs
- **No Real-Time AI**: 6-second delay simulates AI processing; actual GPT calls would replace this

Test
