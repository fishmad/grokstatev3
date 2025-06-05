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
Route::get('/states/{country}', function($countryId) {
    return State::where('country_id', $countryId)->select('id', 'name')->get();
});
Route::get('/suburbs/{state}', function($stateId) {
    return Suburb::where('state_id', $stateId)->select('id', 'name', 'postcode')->get();
});
Route::get('/resolve-location', function(Illuminate\Http\Request $request) {
    $country = Country::firstOrCreate(['name' => $request->country]);
    $state = State::firstOrCreate(['name' => $request->state, 'country_id' => $country->id]);
    $suburb = Suburb::firstOrCreate([
        'name' => $request->suburb,
        'postcode' => $request->postcode,
        'state_id' => $state->id,
    ]);
    return [
        'country_id' => $country->id,
        'state_id' => $state->id,
        'suburb_id' => $suburb->id,
    ];
});
