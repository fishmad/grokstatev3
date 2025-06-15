<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\UpgradeController;
use App\Http\Controllers\MediaController;

Route::get('/', [\App\Http\Controllers\WelcomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});




Route::middleware('auth')->group(function () {
    Route::resource('properties', PropertyController::class)->names([
        //'index' => 'properties.index',
        'create' => 'properties.create',
        'store' => 'properties.store',
        //'show' => 'properties.show',
        'edit' => 'properties.edit',
        'update' => 'properties.update',
        'destroy' => 'properties.destroy',
    ]);
    Route::resource('categories', CategoryController::class)->names([
        'index' => 'categories.index',
        'create' => 'categories.create',
        'store' => 'categories.store',
        'show' => 'categories.show',
        'edit' => 'categories.edit',
        'update' => 'categories.update',
        'destroy' => 'categories.destroy',
    ]);
    Route::resource('features', FeatureController::class)->names([
        'index' => 'features.index',
        'create' => 'features.create',
        'store' => 'features.store',
        'show' => 'features.show',
        'edit' => 'features.edit',
        'update' => 'features.update',
        'destroy' => 'features.destroy',
    ]);
    Route::post('/properties/{property}/upgrades', [UpgradeController::class, 'store'])->middleware('auth')->name('upgrades.store');
    Route::post('/properties/{property}/media', [MediaController::class, 'store'])->middleware('auth')->name('media.store');



// Route::get('/', function () {
//     $properties = \App\Models\Property::with([
//         'media',
//         'listingType',
//         'propertyType',
//         'address',
//         'propertyFeature',
//         'user',
//     ])
//         ->orderByDesc('created_at')
//         ->take(10)
//         ->get();
//     return Inertia::render('welcome', [
//         'properties' => \App\Http\Resources\PropertyResource::collection($properties),
//     ]);
// })->name('home');


    Route::get('my-properties', [PropertyController::class, 'myProperties'])->name('properties.my');

        // Favorite Routes
    Route::get('settings/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('settings/favorites/{property}', [FavoriteController::class, 'store'])->name('favorites.store');
    Route::delete('settings/favorites/{favorite}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');
    
    Route::resource('saved-searches', SavedSearchController::class);
    // Route::resource('messages', MessageController::class);
    // Route::resource('payments', PaymentController::class)->only(['index', 'show', 'store']);





// Socialite routes
Route::get('auth/{provider}', [SocialLoginController::class, 'redirect']);
Route::get('auth/{provider}/callback', [SocialLoginController::class, 'callback']);

Route::get('/properties/lookup', [PropertyLookupController::class, 'lookup']);




    // Special route for the property wizard form
    Route::get('properties/wizard/create', function () {
        // Use the same props as the normal create route
        $propertyTypes = \App\Models\PropertyType::all();
        $listingMethods = \App\Models\ListingMethod::all();
        $listingStatuses = \App\Models\ListingStatus::all();
        $categoryGroups = \App\Models\CategoryType::with(['categories' => function($q) {
            $q->whereNull('parent_id')->with('children');
        }])->get();
        $featureGroups = \App\Models\FeatureGroup::with('features')->get();
        return Inertia::render('properties/properties-create-wizard', [
            'propertyTypes' => $propertyTypes,
            'listingMethods' => $listingMethods,
            'listingStatuses' => $listingStatuses,
            'categoryGroups' => $categoryGroups,
            'featureGroups' => $featureGroups,
        ]);
    })->name('properties.wizard.create');

    Route::get('/properties/{property}/media', function ($propertyId) {
        // Optionally, fetch property and pass to Inertia
        return Inertia::render('properties/properties-create-media', [
            'propertyId' => $propertyId,
            // Optionally, pass property data if needed
        ]);
    })->name('properties.media');

    // Publish property endpoint for wizard
    Route::put('/properties/{property}/publish', [PropertyController::class, 'publish'])->middleware('auth')->name('properties.publish');
    Route::get('/properties/{property}/related', [\App\Http\Controllers\PropertyController::class, 'getRelated'])->name('properties.related');
});

// Remove the public resource for 'create' and 'store' (and optionally 'edit', 'update', 'destroy')
Route::resource('properties', PropertyController::class)->only(['index', 'show'])->names([
    'index' => 'properties.index',
    'show' => 'properties.show',
]);



// Canonical SEO-friendly property show route: /{listing_type_slug}/{state_slug}/{suburb_slug}/{property_identifier_slug}
Route::get('{listing_type_slug}/{state_slug}/{suburb_slug}/{property_identifier_slug}', [PropertyController::class, 'showSeo'])
    ->name('properties.seo.canonical')
    ->where([
        'listing_type_slug' => '[a-z0-9-]+', // e.g., for-sale, for-rent
        'state_slug' => '[a-z0-9-]+', // e.g., nsw, qld, vic
        'suburb_slug' => '[a-z0-9-]+', // e.g., paddington, surry-hills
        'property_identifier_slug' => '[a-z0-9-]+', // e.g., house-123-oxford-street, apartment-modern-living
    ]);

// Short SEO-friendly property show route for /{listing_type_slug}/{property_type_slug}/{suburb_state_slug}
// The showSeo method in PropertyController handles the logic to determine if it's this pattern and redirects to canonical if necessary.
Route::get('{listing_type_slug}/{property_type_slug}/{suburb_state_property_slug}', [PropertyController::class, 'showSeo'])
    ->name('properties.seo.short')
    ->where([
        'listing_type_slug' => '[a-z0-9-]+',
        'property_type_slug' => '[a-z0-9-]+',
        'suburb_state_property_slug' => '[a-z0-9-]+', // e.g., paddington-nsw-house-123-oxford-street
    ]);

// Removed legacy SEO route



// Admin routes moved to routes/admin.php for clarity and maintainability
require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
