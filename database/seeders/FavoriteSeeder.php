<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('favorites')->insert([
            [
                'user_id' => 1,
                'property_id' => 1,
                'notes' => 'Dream home!',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
