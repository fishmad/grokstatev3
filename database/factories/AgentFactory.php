<?php

namespace Database\Factories;

use App\Models\Agent;
use Illuminate\Database\Eloquent\Factories\Factory;

class AgentFactory extends Factory
{
    protected $model = Agent::class;

    public function definition(): array
    {
        return [
            'user_id' => 1, // Adjust as needed
            'unique_listing_agent_id' => $this->faker->unique()->bothify('AGT###'),
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->phoneNumber,
            'agency_name' => $this->faker->company,
            'license_number' => $this->faker->bothify('LIC####'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
