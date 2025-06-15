<?php

namespace Database\Factories;

use App\Models\SavedSearch;
use App\Models\User;
use App\Models\Constant;
use Illuminate\Database\Eloquent\Factories\Factory;

class SavedSearchFactory extends Factory
{
    protected $model = SavedSearch::class;

    public function definition(): array
    {
        $statuses = Constant::getValue('property', 'statuses', ['for sale', 'for rent']);
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->words(3, true),
            'search_parameters' => json_encode([
                'min_price' => $this->faker->optional()->numberBetween(50000, 200000),
                'max_price' => $this->faker->optional()->numberBetween(200000, 1000000),
                'bedrooms' => $this->faker->optional()->numberBetween(1, 5),
                'status' => $this->faker->randomElement($statuses),
            ]),
            'receive_alerts' => $this->faker->boolean(80), // 80% chance of receiving alerts
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
