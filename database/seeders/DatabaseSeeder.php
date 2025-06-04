<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Always create or update the default super-admin user
        \App\Models\User::updateOrCreate(
            ['email' => 'super-admin@test.com'],
            [
                'name' => 'super-admin',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'super-admin',
                'is_agent' => true,
                'is_active' => true,
            ]
        );

        \App\Models\User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'admin',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'is_agent' => true,
                'is_active' => true,
            ]
        );
        
        \App\Models\User::updateOrCreate(
            ['email' => 'agent@test.com'],
            [
                'name' => 'agent',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'agent',
                'is_agent' => true,
                'is_active' => true,
            ]
        );

        \App\Models\User::updateOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'user',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'user',
                
                'is_active' => true,
            ]
        ); 

        // Ensure required records exist for foreign keys
        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        $propertyType = \App\Models\PropertyType::first() ?? \App\Models\PropertyType::create(['name' => 'House']);
        $listingMethod = \App\Models\ListingMethod::first() ?? \App\Models\ListingMethod::create(['name' => 'Sale']);
        $listingStatus = \App\Models\ListingStatus::first() ?? \App\Models\ListingStatus::create(['name' => 'Active']);

        \App\Models\Property::factory(10)->create([
            'user_id' => $user->id,
            'property_type_id' => $propertyType->id,
            'listing_method_id' => $listingMethod->id,
            'listing_status_id' => $listingStatus->id,
        ]);

        // $this->call(RealEstateSeeder::class);
		// $this->call(GrokSeeder::class);
    }
}
