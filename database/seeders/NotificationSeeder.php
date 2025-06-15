<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notifications')->insert([
            [
                'user_id' => 1,
                'type' => 'new_property_match',
                'data' => json_encode(['property_id' => 1, 'message' => 'A new property matches your saved search!']),
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'type' => 'payment_success',
                'data' => json_encode(['invoice_id' => 1, 'message' => 'Your payment was successful.']),
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
