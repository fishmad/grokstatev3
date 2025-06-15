<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AgentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('agents')->insert([
            [
                'user_id' => 1,
                'unique_listing_agent_id' => 'AGENT001',
                'name' => 'John Smith',
                'email' => 'john.smith@agency.com',
                'phone' => '0400000000',
                'agency_name' => 'Smith Realty',
                'license_number' => 'LIC123456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'unique_listing_agent_id' => 'AGENT002',
                'name' => 'Jane Doe',
                'email' => 'jane.doe@agency.com',
                'phone' => '0400000001',
                'agency_name' => 'Doe Estates',
                'license_number' => 'LIC654321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
