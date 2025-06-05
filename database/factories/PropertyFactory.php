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
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
        ];
    }
}
