<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'sender_id' => User::factory(),
            'receiver_id' => User::factory(),
            'property_id' => Property::factory(), // Optional, if message is about a specific property
            'subject' => $this->faker->sentence,
            'body' => $this->faker->paragraphs(3, true),
            'read_at' => $this->faker->optional(0.3)->dateTimeThisMonth(), // 30% chance of being read
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
