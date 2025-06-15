<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $subscription = [
            'user_id' => 1,
            'type' => 'premium',
            'stripe_id' => 'sub_1234567890',
            'stripe_status' => 'active',
            'stripe_price' => 'price_ABC123',
            'quantity' => 1,
            'trial_ends_at' => now()->addDays(14),
            'ends_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        DB::table('subscriptions')->updateOrInsert(
            ['stripe_id' => $subscription['stripe_id']],
            $subscription
        );
    }
}
