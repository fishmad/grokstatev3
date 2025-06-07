<?php
// app/Services/LocationResolutionService.php

namespace App\Services;

use App\Models\Country;
use App\Models\State;
use App\Models\Suburb;
use Illuminate\Support\Str;

class LocationResolutionService
{
    /**
     * Resolve or create country, state, and suburb records from address data.
     * Returns array: [country, state, suburb]
     *
     * @param array $addressData
     * @return array [Country|null, State|null, Suburb|null]
     */
    public function resolve(array $addressData): array
    {
        $country = null;
        $state = null;
        $suburb = null;

        // Normalize names and treat empty strings as null
        $countryName = isset($addressData['country']) && trim($addressData['country']) !== '' ? ucwords(strtolower(trim($addressData['country']))) : null;
        $stateName = isset($addressData['state']) && trim($addressData['state']) !== '' ? ucwords(strtolower(trim($addressData['state']))) : null;
        $suburbName = isset($addressData['suburb']) && trim($addressData['suburb']) !== '' ? ucwords(strtolower(trim($addressData['suburb']))) : null;
        $postcode = isset($addressData['postcode']) && trim($addressData['postcode']) !== '' ? trim($addressData['postcode']) : null;

        if ($countryName) {
            $country = Country::firstOrCreate(['name' => $countryName]);
        } else {
            \Log::warning('LocationResolutionService: No country name provided in addressData', $addressData);
        }
        if ($country && $stateName) {
            $state = State::firstOrCreate([
                'name' => $stateName,
                'country_id' => $country->id,
            ]);
        } else if ($stateName) {
            \Log::warning('LocationResolutionService: No country found for state creation', $addressData);
        }
        if ($state && $suburbName && $postcode) {
            $suburb = Suburb::firstOrCreate([
                'name' => $suburbName,
                'state_id' => $state->id,
                'postcode' => $postcode,
            ]);
        } else {
            \Log::warning('LocationResolutionService: Suburb creation skipped', [
                'state' => $state ? $state->id : null,
                'suburbName' => $suburbName,
                'postcode' => $postcode,
                'addressData' => $addressData
            ]);
        }

        // TBA: In future, optionally flag new locations for admin approval before creation
        // See STATUS.md and BUILD_ORDER.md for notes

        return [$country, $state, $suburb];
    }
}
