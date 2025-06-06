<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\UpgradeController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::resource('properties', PropertyController::class)->names([
        'index' => 'properties.index',
        'create' => 'properties.create',
        'store' => 'properties.store',
        'show' => 'properties.show',
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
