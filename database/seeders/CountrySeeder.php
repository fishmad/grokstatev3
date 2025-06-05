<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Country::firstOrCreate(['name' => 'Australia'], ['iso_code' => 'AU']);
        \App\Models\Country::firstOrCreate(['name' => 'United States'], ['iso_code' => 'US']);
    }
}
