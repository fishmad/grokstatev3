<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\State;
use App\Models\Suburb;

class AustralianSuburbsSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n[AustralianSuburbsSeeder] Running AustralianSuburbsSeeder...\n";

        $australia = Country::where('name', 'Australia')->first();
        if (!$australia) return;

        $states = State::where('country_id', $australia->id)->get()->keyBy('name');

        $suburbs = [
            // NSW
            ['name' => 'Sydney', 'postcode' => '2000', 'state' => 'New South Wales'],
            ['name' => 'Parramatta', 'postcode' => '2150', 'state' => 'New South Wales'],
            ['name' => 'Bondi', 'postcode' => '2026', 'state' => 'New South Wales'],
            // VIC
            ['name' => 'Melbourne', 'postcode' => '3000', 'state' => 'Victoria'],
            ['name' => 'Geelong', 'postcode' => '3220', 'state' => 'Victoria'],
            ['name' => 'St Kilda', 'postcode' => '3182', 'state' => 'Victoria'],
            // QLD
            ['name' => 'Brisbane', 'postcode' => '4000', 'state' => 'Queensland'],
            ['name' => 'Gold Coast', 'postcode' => '4217', 'state' => 'Queensland'],
            ['name' => 'Cairns', 'postcode' => '4870', 'state' => 'Queensland'],
            // WA
            ['name' => 'Perth', 'postcode' => '6000', 'state' => 'Western Australia'],
            ['name' => 'Fremantle', 'postcode' => '6160', 'state' => 'Western Australia'],
            // SA
            ['name' => 'Adelaide', 'postcode' => '5000', 'state' => 'South Australia'],
            ['name' => 'Glenelg', 'postcode' => '5045', 'state' => 'South Australia'],
            // TAS
            ['name' => 'Hobart', 'postcode' => '7000', 'state' => 'Tasmania'],
            ['name' => 'Launceston', 'postcode' => '7250', 'state' => 'Tasmania'],
            // ACT
            ['name' => 'Canberra', 'postcode' => '2600', 'state' => 'Australian Capital Territory'],
            // NT
            ['name' => 'Darwin', 'postcode' => '0800', 'state' => 'Northern Territory'],
        ];

        foreach ($suburbs as $suburb) {
            $state = $states[$suburb['state']] ?? null;
            if (!$state) continue;
            Suburb::updateOrCreate(
                [
                    'name' => $suburb['name'],
                    'state_id' => $state->id,
                ],
                [
                    'postcode' => $suburb['postcode'],
                    'slug' => \Illuminate\Support\Str::slug($suburb['name']),
                ]
            );
        }
    }
}
