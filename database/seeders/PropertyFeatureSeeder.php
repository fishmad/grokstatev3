<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertyFeatureSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('property_features')->insert([
            [
                'property_id' => 1,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'car_spaces' => 1,
                'land_size' => 500.00,
                'new_or_established' => true,
                'outdoor_features' => json_encode(['balcony', 'garden']),
                'indoor_features' => json_encode(['air conditioning', 'built-in robes']),
                'climate_energy_features' => json_encode(['solar panels']),
                'accessibility_features' => json_encode(['wheelchair access']),
                'keywords' => json_encode(['family', 'modern']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'property_id' => 2,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'car_spaces' => 0,
                'land_size' => 300.00,
                'new_or_established' => false,
                'outdoor_features' => json_encode(['courtyard']),
                'indoor_features' => json_encode(['dishwasher']),
                'climate_energy_features' => json_encode(['double glazing']),
                'accessibility_features' => json_encode([]),
                'keywords' => json_encode(['investment', 'city']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
