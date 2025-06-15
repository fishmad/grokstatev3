<?php

namespace Database\Factories;

use App\Models\PropertyFeature;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFeatureFactory extends Factory
{
    protected $model = PropertyFeature::class;

    public function definition(): array
    {
        return [
            'property_id' => null, // To be set in seeder
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 3),
            'car_spaces' => $this->faker->numberBetween(0, 3),
            'land_size' => $this->faker->numberBetween(200, 2000),
            'new_or_established' => $this->faker->boolean(),
            'outdoor_features' => json_encode($this->faker->words(2)),
            'indoor_features' => json_encode($this->faker->words(2)),
            'climate_energy_features' => json_encode($this->faker->words(2)),
            'accessibility_features' => json_encode($this->faker->words(2)),
            'keywords' => json_encode($this->faker->words(3)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
