<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;

class AustralianStatesSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n[AustralianStatesSeeder] Running AustralianStatesSeeder...\n";

        $australia = Country::where('name', 'Australia')->first();
        if (!$australia) {
            $australia = Country::create(['name' => 'Australia']);
        }

        $states = [
            ['name' => 'New South Wales', 'iso_code' => 'NSW'],
            ['name' => 'Victoria', 'iso_code' => 'VIC'],
            ['name' => 'Queensland', 'iso_code' => 'QLD'],
            ['name' => 'Western Australia', 'iso_code' => 'WA'],
            ['name' => 'South Australia', 'iso_code' => 'SA'],
            ['name' => 'Tasmania', 'iso_code' => 'TAS'],
            ['name' => 'Australian Capital Territory', 'iso_code' => 'ACT'],
            ['name' => 'Northern Territory', 'iso_code' => 'NT'],
        ];

        foreach ($states as $state) {
            State::updateOrCreate(
                [
                    'name' => $state['name'],
                    'country_id' => $australia->id,
                ],
                [
                    'iso_code' => $state['iso_code'],
                ]
            );
        }
    }
}
