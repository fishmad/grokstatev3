# Build Order for Property Listing Website

This document outlines the step-by-step process to build a property listing website using Laravel 12.x, React 19, Inertia.js, Tailwind CSS v4.1, and ShadCN/UI in Visual Studio Code (VS Code) with GitHub Copilot assistance. It includes terminal commands, Composer commands, and Copilot prompts to expedite production. The website supports free listings for 6 months, paid upgrades, dynamic attributes, and a marketing-only focus, with a flexible schema using lookup tables and JSON columns.

**Date**: June 4, 2025  
**Tech Stack**: Laravel 12.x, React 19, Inertia.js (specifically `@inertiajs/react` for frontend form handling and SPA functionality), Tailwind CSS v4.1, ShadCN/UI, MySQL, Google Places API, Stripe/PayPal, Laravel Sanctum, Spatie Permissions  
**Tools**: VS Code, GitHub Copilot, Terminal, Composer, npm  
**Project Directory**: `grokstatev3`

---

## 1. Project Setup

Set up the Laravel project in the `grokstatev3` directory, install dependencies, and configure the environment.

### Terminal Commands
```bash
# Clone the Laravel React Starter Kit
git clone https://github.com/laravel/react-starter-kit grokstatev3
cd grokstatev3

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Install Tailwind CSS v4.1
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install ShadCN/UI
npx shadcn-ui@latest init
# Follow prompts: select TypeScript, React, default style, etc.

# Initialize Git
git init
git add .
git commit -m "Initial Laravel setup with Inertia, React, Tailwind, and ShadCN/UI"
```

### Configure Environment
1. Open `.env` in VS Code (`grokstatev3/.env`).
2. Set database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=grokstatev3
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Add Google Places API key and payment gateway credentials:
   ```env
   GOOGLE_PLACES_API_KEY=your-google-places-api-key
   STRIPE_KEY=your-stripe-key
   STRIPE_SECRET=your-stripe-secret
   PAYPAL_CLIENT_ID=your-paypal-client-id
   PAYPAL_SECRET=your-paypal-secret
   ```

### Configure Laravel 12.x
1. Open `bootstrap/app.php` to verify middleware and configuration:
   ```php
   // bootstrap/app.php
   return Application::configure(basePath: dirname(__DIR__))
       ->withRouting(
           web: __DIR__.'/../routes/web.php',
           api: __DIR__.'/../routes/api.php',
           commands: __DIR__.'/../routes/console.php',
           health: '/up',
       )
       ->withMiddleware(function (Middleware $middleware) {
           // Global middleware
       })
       ->withExceptions(function (Exceptions $exceptions) {
           // Exception handling
       })->create();
   ```
2. Ensure Vite is configured for React and Tailwind in `vite.config.js`:
   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite';
   import laravel from 'laravel-vite-plugin';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
       plugins: [
           laravel({
               input: ['resources/ts/app.tsx'],
               refresh: true,
           }),
           react(),
       ],
   });
   ```

### Copilot Prompt
```
// In VS Code, open tailwind.config.js
/* Copilot: Update tailwind.config.js to include paths for resources/ts/**/*.tsx and resources/views/**/*.php */
```

### Files Modified
- `grokstatev3/.env`
- `grokstatev3/tailwind.config.js`
- `grokstatev3/vite.config.js`
- `grokstatev3/bootstrap/app.php`

---

## 2. Authentication

Set up user authentication with Laravel Sanctum for secure API access, leveraging the Laravel React Starter Kit’s R2R implementation.

---

## 2a. Super-Admin Role (Spatie Permissions)

Implement a Super-Admin role using the spatie/laravel-permission package to grant unrestricted access to users with this role.

**Copilot Prompt:**

```plaintext
// In VS Code, open app/Providers/AuthServiceProvider.php
/* Copilot: Add a Gate::before rule to grant all permissions to users with the 'super-admin' role, as per Spatie documentation. */
```

**Example Implementation:**

```php
// app/Providers/AuthServiceProvider.php
use Illuminate\Support\Facades\Gate;

public function boot()
{
    $this->registerPolicies();
    Gate::before(function ($user, $ability) {
        return $user->role === 'super-admin' ? true : null;
    });
}
```

**Seeding a Super-Admin User:**

Ensure your `database/seeders/DatabaseSeeder.php` seeds a user with the `super-admin` role:

```php
\App\Models\User::updateOrCreate(
    ['email' => 'super-admin@test.com'],
    [
        'name' => 'super-admin',
        'password' => bcrypt('12345678'),
        'email_verified_at' => now(),
        'role' => 'super-admin',
        'is_agent' => true,
        'is_active' => true,
    ]
);
```

---

### Terminal Commands
```bash
# Install Sanctum and API routes (already included in Starter Kit, but verify)
php artisan install:api
php artisan migrate
```

### Configure Sanctum
- Sanctum is auto-configured in Laravel 12.x via `php artisan install:api`. No manual changes to `config/sanctum.php` or `bootstrap/app.php` are needed.
- Verify `config/sanctum.php` includes `stateful` domains:
  ```php
  // config/sanctum.php
  'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
  ```
- Ensure `.env` includes:
  ```env
  SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
  ```

### Copilot Prompts
```
// In VS Code, open app/Http/Controllers/Auth/RegisteredUserController.php
/* Copilot: Generate a Laravel controller for user registration with Inertia responses, rendering resources/ts/pages/auth/auth-register.tsx */
```

```
// In VS Code, create resources/ts/pages/auth/auth-register.tsx
/* Copilot: Generate a React registration form using ShadCN/UI components (input, button, form) with TypeScript, handling form submission to /register */
```

```
// In VS Code, create resources/ts/pages/auth/auth-login.tsx
/* Copilot: Generate a React login form using ShadCN/UI components with TypeScript, handling form submission to /login */
```

### Routes
Add auth routes in `routes/web.php`:
```php
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');
```

### Files Modified
- `grokstatev3/config/sanctum.php`
- `grokstatev3/.env`
- `grokstatev3/app/Http/Controllers/Auth/RegisteredUserController.php`
- `grokstatev3/app/Http/Controllers/Auth/AuthenticatedSessionController.php`
- `grokstatev3/resources/ts/pages/auth/auth-register.tsx`
- `grokstatev3/resources/ts/pages/auth/auth-login.tsx`
- `grokstatev3/routes/web.php`

---

## 2b. React Error Boundary Implementation

Add a global React error boundary to catch and display errors in your SPA, following project conventions (kebab-case filename, PascalCase component name, TypeScript, Tailwind, ShadCN/UI).

**Copilot Prompt:**

```plaintext
// In VS Code, create resources/js/components/error-boundary.tsx
/* Copilot: Generate a React ErrorBoundary component in TypeScript, using PascalCase for the component and kebab-case for the filename. Use Tailwind for styling. */
```

**Example Implementation:**

```tsx
// resources/js/components/error-boundary.tsx
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Something went wrong.</h1>
          <pre className="bg-gray-100 p-4 rounded text-left overflow-x-auto text-xs">
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && <div>{this.state.errorInfo.componentStack}</div>}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Integration:**

Wrap your Inertia App in the error boundary in `resources/js/app.tsx`:

```tsx
import { ErrorBoundary } from './components/error-boundary';
// ...existing code...
root.render(
  <ErrorBoundary>
    <App {...props} />
  </ErrorBoundary>
);
```

---

## 3. Database Schema

Implement the database schema with migrations, including lookup tables, JSON columns, and pivot tables for flexibility.

### Terminal Commands
```bash
# Generate migration for database schema
php artisan make:migration create_database_schema
```

### Copilot Prompt
```
// In VS Code, open database/migrations/2025_06_04_121000_create_database_schema.php
/* Copilot: Generate a Laravel migration for tables: users, properties, addresses, countries, states, suburbs, property_types, listing_methods, listing_statuses, category_types, listing_authorities, tenancy_types, area_units, tax_types, categories, property_category, features, feature_groups, feature_group_feature, property_feature, prices, property_agent, upgrades, transactions, subscriptions, media. Use fields from artifact ID 81057555-134d-4995-aa91-b47ce3ec3ccd */
```

### Run Migration
```bash
php artisan migrate
```

### Generate Models
```bash
# Generate Eloquent models
php artisan make:model Property -m
php artisan make:model Address -m
php artisan make:model Country -m
php artisan make:model State -m
php artisan make:model Suburb -m
php artisan make:model PropertyType -m
php artisan make:model ListingMethod -m
php artisan make:model ListingStatus -m
php artisan make:model CategoryType -m
php artisan make:model ListingAuthority -m
php artisan make:model TenancyType -m
php artisan make:model AreaUnit -m
php artisan make:model TaxType -m
php artisan make:model Category -m
php artisan make:model Feature -m
php artisan make:model FeatureGroup -m
php artisan make:model Price -m
php artisan make:model Upgrade -m
php artisan make:model Transaction -m
php artisan make:model Subscription -m
php artisan make:model Media -m
```

### Copilot Prompt
```
// In VS Code, open app/Models/Property.php
/* Copilot: Generate an Eloquent model for Property with relationships: belongsTo User, hasOne Address, belongsTo PropertyType, belongsTo ListingMethod, belongsTo ListingStatus, belongsToMany Category (pivot: property_category), belongsToMany Feature (pivot: property_feature), hasMany Price, belongsToMany User (pivot: property_agent with agent_order, receive_campaign_report), hasMany Upgrade, hasMany Transaction, hasMany Subscription, hasMany Media. Cast dynamic_attributes to array, is_free to boolean, expires_at to datetime */
```

### Files Modified
- `grokstatev3/database/migrations/2025_06_04_121000_create_database_schema.php`
- `grokstatev3/app/Models/*.php`

---

## 4. Property Management

Implement CRUD operations for properties, including address autofill and slug generation.

### Terminal Commands
```bash
# Generate PropertyController
php artisan make:controller PropertyController --resource
```

### Copilot Prompts
```
// In VS Code, open app/Http/Controllers/PropertyController.php
/* Copilot: Generate a Laravel resource controller for Property with Inertia responses. Implement index (paginate with address), create (render properties-create.tsx), store (validate and set expires_at to created_at + 6 months), show (render properties-show.tsx), edit (render properties-edit.tsx), update, destroy (soft delete). Use slug for show/edit routes */
```

```
// In VS Code, create resources/ts/pages/properties/properties-create.tsx
/* Copilot: Generate a React form using ShadCN/UI components (input, select, button) with TypeScript for creating a property. Include fields for title, description, property_type_id, listing_method_id, listing_status_id, beds, baths, parking_spaces, land_size_sqm, building_size_sqm, ensuites, garage_spaces, dynamic_attributes (JSON input), and address (use address-autofill.tsx). Submit to /properties */
```

```
// In VS Code, create resources/ts/components/address-autofill.tsx
/* Copilot: Generate a React component with TypeScript that integrates Google Places API for address autofill. Extract street_number, street_name, suburb, lat, long from the selected place and call onChange callback with these values. Use a text input with id="address-input" */
```

### Routes
Add to `routes/web.php`:
```php
use App\Http\Controllers\PropertyController;

Route::resource('properties', PropertyController::class)->middleware('auth')->names([
    'index' => 'properties.index',
    'create' => 'properties.create',
    'store' => 'properties.store',
    'show' => 'properties.show',
    'edit' => 'properties.edit',
    'update' => 'properties.update',
    'destroy' => 'properties.destroy',
]);
```

### Slug Generation
Update `app/Models/Property.php`:
```php
protected static function boot() {
    parent::boot();
    static::creating(function ($property) {
        $property->slug = \Str::slug($property->title);
    });
}
```

### Files Modified
- `grokstatev3/app/Http/Controllers/PropertyController.php`
- `grokstatev3/app/Models/Property.php`
- `grokstatev3/resources/ts/pages/properties/properties-create.tsx`
- `grokstatev3/resources/ts/pages/properties/properties-edit.tsx`
- `grokstatev3/resources/ts/pages/properties/properties-show.tsx`
- `grokstatev3/resources/ts/pages/properties/properties-index.tsx`
- `grokstatev3/resources/ts/components/address-autofill.tsx`
- `grokstatev3/routes/web.php`

---

## 5. Category & Feature Management

Implement management for categories and features, with dynamic rendering in the frontend.

### Terminal Commands
```bash
# Generate controllers
php artisan make:controller CategoryController --resource
php artisan make:controller FeatureController --resource
```

### Copilot Prompts
```
// In VS Code, open app/Http/Controllers/CategoryController.php
/* Copilot: Generate a Laravel resource controller for Category with Inertia responses. Implement index (fetch with parent), create, store, edit, update, destroy. Render categories-index.tsx, categories-create.tsx, categories-edit.tsx */
```

```
// In VS Code, create resources/ts/pages/categories/categories-index.tsx
/* Copilot: Generate a React page using ShadCN/UI components (table, button) with TypeScript to display categories with name, slug, parent, category_type_id. Include links to edit/delete */
```

```
// In VS Code, open app/Http/Controllers/FeatureController.php
/* Copilot: Generate a Laravel resource controller for Feature with Inertia responses. Implement index (fetch with feature_groups), create, store, edit, update, destroy. Render features-index.tsx, features-create.tsx, features-edit.tsx */
```

### Routes
Add to `routes/web.php`:
```php
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FeatureController;

Route::resource('categories', CategoryController::class)->middleware('auth')->names([
    'index' => 'categories.index',
    'create' => 'categories.create',
    'store' => 'categories.store',
    'show' => 'categories.show',
    'edit' => 'categories.edit',
    'update' => 'categories.update',
    'destroy' => 'categories.destroy',
]);
Route::resource('features', FeatureController::class)->middleware('auth')->names([
    'index' => 'features.index',
    'create' => 'features.create',
    'store' => 'features.store',
    'show' => 'features.show',
    'edit' => 'features.edit',
    'update' => 'features.update',
    'destroy' => 'features.destroy',
]);
```

### Files Modified
- `grokstatev3/app/Http/Controllers/CategoryController.php`
- `grokstatev3/app/Http/Controllers/FeatureController.php`
- `grokstatev3/resources/ts/pages/categories/categories-index.tsx`
- `grokstatev3/resources/ts/pages/categories/categories-create.tsx`
- `grokstatev3/resources/ts/pages/categories/categories-edit.tsx`
- `grokstatev3/resources/ts/pages/features/features-index.tsx`
- `grokstatev3/resources/ts/pages/features/features-create.tsx`
- `grokstatev3/resources/ts/pages/features/features-edit.tsx`
- `grokstatev3/routes/web.php`

---

## 6. Search Functionality

Build a unified search with filters for property type, category, suburb, status, and price range.

### Terminal Commands
```bash
# Generate SearchController
php artisan make:controller SearchController
```

### Copilot Prompt
```
// In VS Code, open app/Http/Controllers/SearchController.php
/* Copilot: Generate a Laravel controller with an index method for property search. Use Eloquent to filter by property_type_id, category_id, suburb_id, listing_status_id (exclude is_historical), price range from prices table. Join upgrades to prioritize active upgrades. Return Inertia response for search/search-index.tsx with paginated results */
```

```
// In VS Code, create resources/ts/pages/search/search-index.tsx
/* Copilot: Generate a React search form using ShadCN/UI components (select, input, button) with TypeScript. Include filters for property_type_id, category_id, suburb_id, listing_status_id, price_min, price_max. Submit to /search via Inertia.get. Display results in a grid */
```

### Routes
Add to `routes/web.php`:
```php
use App\Http\Controllers/SearchController;

Route::get('/search', [SearchController::class, 'index'])->name('search.index');
```

### Files Modified
- `grokstatev3/app/Http/Controllers/SearchController.php`
- `grokstatev3/resources/ts/pages/search/search-index.tsx`
- `grokstatev3/routes/web.php`

---

## 7. Payment Integration

Integrate Stripe and PayPal for paid upgrades using Laravel Cashier.

### Terminal Commands
```bash
# Install Laravel Cashier
composer require laravel/cashier
php artisan vendor:publish --provider="Laravel\Cashier\CashierServiceProvider"
php artisan migrate
```

### Copilot Prompt
```
// In VS Code, open app/Http/Controllers/UpgradeController.php
/* Copilot: Generate a Laravel controller for Upgrade with a store method. Use Laravel Cashier to process Stripe/PayPal payments for upgrades. Create an upgrade record with upgrade_type, start_date (now), end_date (now + 30 days), is_subscription, auto_renew. Store payment in transactions table. Redirect to properties-show.tsx */
```

```
// In VS Code, create resources/ts/pages/upgrades/upgrades-create.tsx
/* Copilot: Generate a React form using ShadCN/UI components with TypeScript for purchasing upgrades. Include fields for upgrade_type (select), is_subscription (checkbox), auto_renew (checkbox), payment_method (Stripe/PayPal). Submit to /properties/{id}/upgrades */
```

### Routes
Add to `routes/web.php`:
```php
use App\Http\Controllers\UpgradeController;

Route::post('/properties/{property}/upgrades', [UpgradeController::class, 'store'])->middleware('auth')->name('upgrades.store');
```

### Files Modified
- `grokstatev3/app/Http/Controllers/UpgradeController.php`
- `grokstatev3/resources/ts/pages/upgrades/upgrades-create.tsx`
- `grokstatev3/routes/web.php`

---

## 8. Admin Dashboard

Build an admin dashboard for managing users, properties, categories, and features.

> **Note:** All admin pages must be placed in their own subfolders under `resources/js/pages/admin/{resource}/` (e.g., `resources/js/pages/admin/properties/properties-index.tsx`). Do not reuse public-facing pages directly for admin. Instead, create admin-specific variants and extract shared UI or logic into `resources/js/components/{resource}/` for reuse. For components used across multiple resources, use `resources/js/components/shared/`.

### Terminal Commands
```bash
# Generate admin controllers
php artisan make:controller Admin/AdminPropertyController --resource
php artisan make:controller Admin/AdminCategoryController --resource
php artisan make:controller Admin/AdminFeatureController --resource
```

### Copilot Prompt
```
// In VS Code, open app/Http/Controllers/Admin/AdminPropertyController.php
/* Copilot: Generate a Laravel resource controller for admin property management with Inertia responses. Implement index, create, store, edit, update, destroy. Restrict access to admin role. Render admin/properties-index.tsx, admin/properties-create.tsx */
```

```
// In VS Code, create resources/ts/pages/admin/properties-index.tsx
/* Copilot: Generate a React page using ShadCN/UI components (table, button) with TypeScript for admin property management. Display properties with title, slug, status, type. Include edit/delete links */
```

### Routes
Add to `routes/web.php`:
```php
use App\Http\Controllers\Admin\AdminPropertyController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminFeatureController;

Route::prefix('admin')->middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('properties', AdminPropertyController::class)->names([
        'index' => 'admin.properties.index',
        'create' => 'admin.properties.create',
        'store' => 'admin.properties.store',
        'show' => 'admin.properties.show',
        'edit' => 'admin.properties.edit',
        'update' => 'admin.properties.update',
        'destroy' => 'admin.properties.destroy',
    ]);
    Route::resource('categories', AdminCategoryController::class)->names([
        'index' => 'admin.categories.index',
        'create' => 'admin.categories.create',
        'store' => 'admin.categories.store',
        'show' => 'admin.categories.show',
        'edit' => 'admin.categories.edit',
        'update' => 'admin.categories.update',
        'destroy' => 'admin.categories.destroy',
    ]);
    Route::resource('features', AdminFeatureController::class)->names([
        'index' => 'admin.features.index',
        'create' => 'admin.features.create',
        'store' => 'admin.features.store',
        'show' => 'admin.features.show',
        'edit' => 'admin.features.edit',
        'update' => 'admin.features.update',
        'destroy' => 'admin.features.destroy',
    ]);
});
```

### Authorization
Create policy (`app/Policies/PropertyPolicy.php`):
```bash
php artisan make:policy PropertyPolicy
```

### Copilot Prompt
```
// In VS Code, open app/Policies/PropertyPolicy.php
/* Copilot: Generate a Laravel policy for Property. Allow admins to viewAny, view, create, update, delete. Allow users to view their own properties and create new ones */
```

### Files Modified
- `grokstatev3/app/Http/Controllers/Admin/*.php`
- `grokstatev3/app/Policies/PropertyPolicy.php`
- `grokstatev3/resources/ts/pages/admin/properties-index.tsx`
- `grokstatev3/resources/ts/pages/admin/properties-create.tsx`
- `grokstatev3/resources/ts/pages/admin/categories-index.tsx`
- `grokstatev3/resources/ts/pages/admin/features-index.tsx`
- `grokstatev3/routes/web.php`

---

## 9. Media Upload

Implement file upload for property images, videos, and documents.

### Terminal Commands
```bash
# Generate MediaController
php artisan make:controller MediaController
```

### Copilot Prompt
```
// In VS Code, open app/Http/Controllers/MediaController.php
/* Copilot: Generate a Laravel controller for Media with a store method. Handle file uploads (image, video, document) using Laravel's file storage. Save URL to media table with property_id, type. Redirect back to properties-show.tsx */
```

```
// In VS Code, create resources/ts/components/media-upload.tsx
/* Copilot: Generate a React component using ShadCN/UI components with TypeScript for file uploads. Support multiple files (image, video, document). Submit to /properties/{id}/media */
```

### Routes
Add to `routes/web.php`:
```php
use App\Http\Controllers\MediaController;

Route::post('/properties/{property}/media', [MediaController::class, 'store'])->middleware('auth')->name('media.store');
```

### Files Modified
- `grokstatev3/app/Http/Controllers/MediaController.php`
- `grokstatev3/resources/ts/components/media-upload.tsx`
- `grokstatev3/routes/web.php`

---

## 10. Listing Lifecycle

Manage the property lifecycle, marking expired free listings as historic.

### Terminal Commands
```bash
# Generate command
php artisan make:command MarkHistoricProperties
```

### Copilot Prompt
```
// In VS Code, open app/Console/Commands/MarkHistoricProperties.php
/* Copilot: Generate a Laravel command to mark free properties with expires_at < now and listing_status_id = Current as Historic. Update listing_status_id to Historic */
```

### Schedule Command
Update `app/Console/Kernel.php`:
```php
protected function schedule(Schedule $schedule) {
    $schedule->command('properties:mark-historic')->daily();
}
```

### Files Modified
- `grokstatev3/app/Console/Commands/MarkHistoricProperties.php`
- `grokstatev3/app/Console/Kernel.php`

---

## 11. Frontend Enhancements

Add dynamic rendering, social sharing, and SEO optimizations.

### Copilot Prompts
```
// In VS Code, create resources/ts/components/property-details.tsx
/* Copilot: Generate a React component using ShadCN/UI components with TypeScript to display property details (title, description, beds, baths, categories, features). Fetch data from Inertia props */
```

```
// In VS Code, create resources/ts/components/social-share.tsx
/* Copilot: Generate a React component with TypeScript for social sharing buttons (Facebook, X). Use respective APIs to share property URL */
```

```
// In VS Code, update resources/ts/pages/properties/properties-show.tsx
/* Copilot: Add SEO meta tags and Schema.org structured data for properties. Use Inertia Head component to set title, description, and JSON-LD */
```

### Files Modified
- `grokstatev3/resources/ts/components/property-details.tsx`
- `grokstatev3/resources/ts/components/social-share.tsx`
- `grokstatev3/resources/ts/pages/properties/properties-show.tsx`

---

## 12. Testing

Write unit, feature, and browser tests to ensure functionality.

### Terminal Commands
```bash
# Install Laravel Dusk
composer require --dev laravel/dusk
php artisan dusk:install
```

### Copilot Prompts
```
// In VS Code, create tests/Feature/PropertyTest.php
/* Copilot: Generate PHPUnit tests for PropertyController. Test index (returns paginated properties), store (creates property with expires_at), show (returns property by slug), update, destroy */
```

```
// In VS Code, create tests/Browser/PropertyCreateTest.php
/* Copilot: Generate Laravel Dusk test for property creation. Navigate to /properties/create, fill form, submit, assert redirect and database entry */
```

### Run Tests
```bash
php artisan test
php artisan dusk
```

### Files Modified
- `grokstatev3/tests/Feature/PropertyTest.php`
- `grokstatev3/tests/Browser/PropertyCreateTest.php`

---

## 13. Deployment

Deploy the application to a production server with SSL and CDN.

### Terminal Commands
```bash
# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Install Laravel Telescope for monitoring
composer require laravel/telescope
php artisan telescope:install
php artisan migrate
```

### Deployment Steps
1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```
2. Deploy to AWS/DigitalOcean using Laravel Forge or similar.
3. Configure SSL with Let’s Encrypt.
4. Set up AWS CloudFront for media:
   - Create a CloudFront distribution pointing to your storage bucket.
   - Update `config/filesystems.php`:
     ```php
     'public' => [
         'driver' => 's3',
         'key' => env('AWS_ACCESS_KEY_ID'),
         'secret' => env('AWS_SECRET_ACCESS_KEY'),
         'region' => env('AWS_DEFAULT_REGION'),
         'bucket' => env('AWS_BUCKET'),
         'url' => env('AWS_URL'),
     ],
     ```

### Files Modified
- `grokstatev3/config/filesystems.php`
- `grokstatev3/.env`

---

## Key Learnings & Best Practices (as of June 8, 2025)

- **Frontend/Backend Data Consistency:**
  - Always keep frontend and backend field names, types, and data structures in sync—especially for nested objects (e.g., address, price, features). Use TypeScript interfaces and backend casts to ensure type safety and avoid bugs.

- **Dropdowns and Selects:**
  - When using dropdowns for fields like beds, baths, and parking, always provide a "None" or "Unset" option with a non-empty value (e.g., 'unset') to avoid React/Select errors. Ensure the onValueChange handler and value prop are compatible with this.

- **UI/UX Consistency:**
  - Place all field labels above their inputs for clarity and consistency. Use flex layouts to keep related fields (e.g., land size/unit, building size/unit) on a single line for a modern, compact UI.

- **Default Values:**
  - Set sensible default values for dropdowns (e.g., land size unit = 'sqm', building size unit = 'sqft') to streamline data entry and reduce user errors.

- **Map Integration:**
  - Set a reasonable default zoom level for Google Maps (e.g., 8 for region-level view) to improve usability. Always check and document which address components are mapped to which fields.

- **Draft and Error Handling:**
  - Implement robust draft saving and restoration, with clear user feedback and error handling. Use AlertDialogs for important actions (e.g., draft recovery/reset) instead of toasts for better accessibility and clarity.

- **Seeders and Data Integrity:**
  - When using JSON columns (e.g., display_names), always store as arrays and cast appropriately in models. Avoid using json_encode in seeders—let Laravel handle JSON casting.

- **Component Reusability:**
  - Refactor repeated UI patterns (e.g., icon box selectors, dropdowns) into reusable components for maintainability and consistency.

- **Testing and Validation:**
  - After major refactors, always reseed the database and test both backend and frontend to ensure data is being handled as expected (e.g., display_names as array, not string).

---

## Conclusion

This build order provides a clear, actionable roadmap for developing your property listing website in VS Code with GitHub Copilot. It leverages Laravel 12.x’s features, integrates React with Inertia.js for a modern frontend, and uses Tailwind CSS v4.1 and ShadCN/UI for styling. The schema supports flexibility with lookup tables and JSON columns, and the workflow ensures free listings, paid upgrades, and a marketing-only focus. Run the terminal commands, follow the Copilot prompts, and refer to the file paths to expedite production.


Refer to `.github/STATUS.md` for the full roadmap status.
Refer to `.github/COPILOT_STANDING_ORDER.md` for COPILOT STANDING ORDER requirements.

---

## Standards and Conventions

To maintain consistency and quality across the project, adhere to the following standards and conventions:

- Enforce kebab-case for all new files, folders, and React component names.
- Place resource-specific components in `resources/js/components/{resource-name}/` and shared components in `resources/js/components/shared/`.
- Place public-facing pages in `resources/js/pages/public/` and admin pages in `resources/js/pages/admin/`. Do not reuse public pages for admin or vice versa.
- When adding new features, always update the folder structure and naming to match these conventions.
- Document any exceptions or changes in STATUS.md and COPILOT_STANDING_ORDER.md.

---

## 3. Address & Location Resolution (Backend)

- Implement a **dedicated LocationResolutionService** (see `app/Services/LocationResolutionService.php`) to handle country, state, and suburb lookup/creation from address strings. This allows for easy adaptation if the address lookup API/service changes in the future.
  - See usage example in `PropertyController@store` and related service methods for integration details.
  - For address component mapping, refer to code comments in `LocationResolutionService.php` and the documentation in `PROPERTY-WIZARD.md` (section: Address Mapping).
- Use this service in `PropertyController@store` to resolve or create location records and return their IDs for address creation.
- All address/location validation and merging is handled in `StorePropertyRequest` (see rules and `prepareForValidation`).
- **Planned: Admin Approval Workflow for New Locations**
  - When a new country, state, or suburb is created, flag it for admin review before it becomes active/usable in listings. This will allow for curation and prevent unwanted/duplicate locations.
  - Implementation options: add a `pending_approval` or `is_active` flag to location tables, trigger admin notifications, and provide a review UI in the admin dashboard.
  - See also `STATUS.md` for tracking and future updates on this workflow.