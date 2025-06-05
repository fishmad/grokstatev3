<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use Spatie\Permission\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure Spatie roles exist before assigning (removed 'user' role)
        foreach (['super-admin', 'admin', 'agent'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // User::factory(10)->create();

        // Always create or update the default super-admin user
        $superAdmin = \App\Models\User::updateOrCreate(
            ['email' => 'super-admin@test.com'],
            [
                'name' => 'super-admin',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'super-admin', // NOTE: This column is NOT used by Spatie permissions. See migration for annotation.
                'is_agent' => true,
                'is_active' => true,
            ]
        );
        $superAdmin->assignRole('super-admin');

        $admin = \App\Models\User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'admin',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'admin', // NOTE: Not used by Spatie
                'is_agent' => true,
                'is_active' => true,
            ]
        );
        $admin->assignRole('admin');
        
        $agent = \App\Models\User::updateOrCreate(
            ['email' => 'agent@test.com'],
            [
                'name' => 'agent',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'agent', // NOTE: Not used by Spatie
                'is_agent' => true,
                'is_active' => true,
            ]
        );
        $agent->assignRole('agent');

        $user = \App\Models\User::updateOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'user',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'user', // NOTE: Not used by Spatie
                'is_active' => true,
            ]
        );
        // No assignRole for 'user' (default users have no role)

        // Ensure required records exist for foreign keys
        $user = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        $propertyType = \App\Models\PropertyType::first() ?? \App\Models\PropertyType::create(['name' => 'House']);
        $listingMethod = \App\Models\ListingMethod::first() ?? \App\Models\ListingMethod::create(['name' => 'Sale']);
        $listingStatus = \App\Models\ListingStatus::first() ?? \App\Models\ListingStatus::create(['name' => 'Active']);

        \App\Models\Property::factory(21)->create([
            'user_id' => $user->id,
            'property_type_id' => $propertyType->id,
            'listing_method_id' => $listingMethod->id,
            'listing_status_id' => $listingStatus->id,
        ]);

        // $this->call(RealEstateSeeder::class);
        // $this->call(GrokSeeder::class);
        $this->call(FeatureSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(PropertyTypeSeeder::class);
        $this->call(ListingMethodSeeder::class);
        $this->call(ListingStatusSeeder::class);
    }
}
