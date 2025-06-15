<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Country;
use App\Models\State;
use App\Models\Suburb;

use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\SavedSearchController;
use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/countries', function() {
    return Country::select('id', 'name')->get();
});
// Consider caching /api/countries if the dataset is static (e.g., using Cache::remember)
// Route::get('/countries', function() {
//     return Cache::remember('countries', 3600, function() {
//         return Country::select('id', 'name')->get();
//     });
// });

Route::get('/states/{country}', function($country) {
    return State::where('country_id', (int)$country)->select('id', 'name')->get();
});
Route::get('/suburbs/{state}', function($state) {
    return Suburb::where('state_id', (int)$state)->select('id', 'name', 'postcode')->get();
});


// Add Middleware: If only authenticated users should create records, add ->middleware('auth:sanctum').
Route::post('/resolve-location', function(Request $request) {
    $validated = $request->validate([
        'country' => 'required|string|max:255',
        'state' => 'required|string|max:255',
        'suburb' => 'required|string|max:255',
        'postcode' => 'required|string|max:20',
    ]);
    $country = Country::firstOrCreate(['name' => $validated['country']]);
    $state = State::firstOrCreate(['name' => $validated['state'], 'country_id' => $country->id]);
    $suburb = Suburb::firstOrCreate([
        'name' => $validated['suburb'],
        'postcode' => $validated['postcode'],
        'state_id' => $state->id,
    ]);
    return [
        'country_id' => $country->id,
        'state_id' => $state->id,
        'suburb_id' => $suburb->id,
    ];
});






Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('register', [AuthController::class, 'register']);

// Admin menu API routes (stateless, no CSRF required)
Route::prefix('admin/menu')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\AdminMenuController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\Admin\AdminMenuController::class, 'store']);
    Route::put('/{id}', [\App\Http\Controllers\Admin\AdminMenuController::class, 'update']);
    Route::delete('/{id}', [\App\Http\Controllers\Admin\AdminMenuController::class, 'destroy']);
    Route::post('/reorder', [\App\Http\Controllers\Admin\AdminMenuController::class, 'reorder']);
});

// Socialite OAuth routes
Route::get('auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

// REMOVE auth:sanctum for dev testing
Route::group([], function () {
    Route::apiResource('addresses', AddressController::class);
    Route::apiResource('agents', AgentController::class);
    Route::apiResource('favorites', FavoriteController::class);
    Route::apiResource('media', MediaController::class);
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::delete('media/{id}/remove-file', [MediaController::class, 'removeFile']);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('notifications', NotificationController::class);
    Route::apiResource('properties', PropertyController::class);
    //Route::apiResource('property-features', PropertyFeatureController::class);
    Route::post('payments/subscribe', [PaymentController::class, 'subscribe']);
    Route::post('payments/one-time', [PaymentController::class, 'oneTime']);
    Route::get('payments/status', [PaymentController::class, 'status']);
    Route::apiResource('saved-searches', SavedSearchController::class);
    Route::apiResource('subscriptions', \App\Http\Controllers\Api\SubscriptionController::class)->only(['index', 'store', 'destroy']);
});

Route::group([], function () {
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('payments', PaymentController::class)->only(['index', 'show']);
    Route::apiResource('users', UserController::class)->except(['store']);
});

// Stripe webhook endpoint
Route::post('stripe/webhook', [\App\Http\Controllers\Api\StripeWebhookController::class, 'handleWebhook']);
Route::get('rea/test-token', [\App\Http\Controllers\Api\ReaTestController::class, 'token']);
Route::post('google-maps/geocode', [\App\Http\Controllers\Api\GoogleMapsController::class, 'geocode']);
Route::get('reaxml/generate/{id}', [\App\Http\Controllers\Api\ReaxmlTestController::class, 'generate']);
Route::post('rea/export/{id}', [\App\Http\Controllers\Api\ReaExportController::class, 'export']);
Route::get('/google-maps/autocomplete', [\App\Http\Controllers\Api\GoogleMapsController::class, 'autocomplete']);

