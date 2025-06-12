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
                'country_id' => $australia ? $australia->id : null,
                'state_id' => $state ? $state->id : null,
                'suburb_id' => $suburb ? $suburb->id : null,
                'postcode' => $suburb ? $suburb->postcode : fake()->postcode(),
                'street_number' => fake()->buildingNumber(),
                'street_name' => fake()->streetName(),
                'unit_number' => fake()->optional()->buildingNumber(),
                'lot_number' => fake()->optional()->buildingNumber(),
                'region_name' => fake()->optional()->citySuffix(),
                'latitude' => fake()->latitude(-44, -10),
                'longitude' => fake()->longitude(112, 154),
                'display_address_on_map' => true,
                'display_street_view' => true,
            ]);

            // Attach random categories to the property
            $categoryIds = \App\Models\Category::inRandomOrder()->limit(rand(1, 2))->pluck('id')->toArray();
            if (!empty($categoryIds)) {
                $property->categories()->sync($categoryIds);
            }
            // Attach random features to the property
            $featureIds = \App\Models\Feature::inRandomOrder()->limit(rand(1, 2))->pluck('id')->toArray();
            if (!empty($featureIds)) {
                $property->features()->sync($featureIds);
            }

            // Optionally add random dynamic attributes to ~10% of properties
            if (rand(1, 10) === 1) { // ~10% chance
                $attributes = [];
                $attrCount = rand(1, 3);
                for ($i = 0; $i < $attrCount; $i++) {
                    $key = 'attr_' . fake()->unique()->word();
                    $value = fake()->sentence(2);
                    $attributes[$key] = $value;
                }
                $property->dynamic_attributes = json_encode($attributes);
                $property->save();
            }
        });
    }
}
