<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        $title = $this->faker->streetName . ' ' . $this->faker->word;

        return [
            'user_id' => 1, // Adjust as needed
            'property_type_id' => 1,
            'listing_method_id' => 1,
            'listing_status_id' => 1,
            'title' => $title,
            'description' => $this->faker->paragraph,
            'beds' => $this->faker->numberBetween(1, 6),
            'baths' => $this->faker->numberBetween(1, 4),
            'parking_spaces' => $this->faker->numberBetween(0, 3),
            'land_size' => $this->faker->numberBetween(100, 1000),
            'land_size_unit' => $this->faker->randomElement(['sqm', 'ha']),
            'building_size' => $this->faker->numberBetween(80, 500),
            'building_size_unit' => $this->faker->randomElement(['sqm', 'ha']),
            'ensuites' => $this->faker->numberBetween(0, 2),
            'garage_spaces' => $this->faker->numberBetween(0, 2),
            'dynamic_attributes' => json_encode([]),
            'is_free' => $this->faker->boolean,
            'expires_at' => now()->addMonths(6),
            'slug' => $this->faker->slug,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Property $property) {
            // Create a price for each property
            $property->price()->create(
                \Database\Factories\PriceFactory::new()->make(['property_id' => $property->id])->toArray()
            );

            // Create an address for each property using seeded Australian data
            $australia = \App\Models\Country::where('name', 'Australia')->first();
            $state = $australia ? \App\Models\State::where('country_id', $australia->id)->inRandomOrder()->first() : null;
            $suburb = $state ? \App\Models\Suburb::where('state_id', $state->id)->inRandomOrder()->first() : null;
            $property->address()->create([
                //'state_id' => $state ? $state->id : null,
                'suburb_id' => $suburb ? $suburb->id : null,
                'street_number' => fake()->buildingNumber(),
                'street_name' => fake()->streetName(),
                'unit_number' => fake()->optional()->buildingNumber(),
                'lot_number' => fake()->optional()->buildingNumber(),
                'site_name' => fake()->optional()->company(),
                'region_name' => fake()->optional()->citySuffix(),
                'lat' => fake()->latitude(-44, -10),
                'long' => fake()->longitude(112, 154),
                'display_address_on_map' => true,
                'display_street_view' => true,
            ]);
        });
    }
}
