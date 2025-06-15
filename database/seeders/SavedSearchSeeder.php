<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SavedSearchSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('saved_searches')->insert([
            [
                'user_id' => 1,
                'search_criteria' => json_encode(['suburb' => 'Sydney', 'min_price' => 1000000]),
                'name' => 'Sydney Dream Homes',
                'notification_frequency' => 'daily',
                'receive_alerts' => true,
                'last_notified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'search_criteria' => json_encode(['suburb' => 'Melbourne', 'max_price' => 800000]),
                'name' => 'Melbourne Bargains',
                'notification_frequency' => 'weekly',
                'receive_alerts' => false,
                'last_notified_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
