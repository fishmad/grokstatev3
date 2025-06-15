<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleMapsService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
    }

    /**
     * Geocode an address string to get latitude and longitude.
     *
     * @param string $address
     * @return array|null [ 'lat' => float, 'lng' => float ] or null on failure
     */
    public function geocodeAddress(string $address): ?array
    {
        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $address,
            'key' => $this->apiKey,
        ]);
        if ($response->ok() && isset($response['results'][0]['geometry']['location'])) {
            return $response['results'][0]['geometry']['location'];
        }
        return null;
    }

    /**
     * Get Google Places Autocomplete suggestions for a partial address.
     *
     * @param string $input
     * @param array $options (optional: e.g., 'location', 'radius', 'types', 'components')
     * @return array|null
     */
    public function autocomplete(string $input, array $options = []): ?array
    {
        $params = array_merge([
            'input' => $input,
            'key' => $this->apiKey,
        ], $options);
        $response = Http::get('https://maps.googleapis.com/maps/api/place/autocomplete/json', $params);
        if ($response->ok() && isset($response['predictions'])) {
            return $response['predictions'];
        }
        return null;
    }
}
