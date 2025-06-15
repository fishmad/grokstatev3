<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionItemSeeder extends Seeder
{
    public function run(): void
    {
        $item = [
            'subscription_id' => 1,
            'stripe_id' => 'si_1234567890',
            'stripe_product' => 'prod_ABC123',
            'stripe_price' => 'price_ABC123',
            'quantity' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        DB::table('subscription_items')->updateOrInsert(
            ['stripe_id' => $item['stripe_id']],
            $item
        );
    }
}
