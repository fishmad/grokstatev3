<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Country;
use App\Models\State;
use App\Models\Suburb;

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
