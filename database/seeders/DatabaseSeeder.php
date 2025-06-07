<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use App\Models\Price;
use App\Models\PropertyType;
use App\Models\ListingMethod;
use App\Models\ListingStatus;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure Spatie roles exist before assigning
        foreach (['super-admin', 'admin', 'agent'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Create users with roles
        $superAdmin = User::updateOrCreate(
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
        $superAdmin->assignRole('super-admin');

        $admin = User::updateOrCreate(
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
        $admin->assignRole('admin');

        $agent = User::updateOrCreate(
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
        $agent->assignRole('agent');

        $user = User::updateOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'user',
                'password' => bcrypt('12345678'),
                'email_verified_at' => now(),
                'role' => 'user',
                'is_active' => true,
            ]
        );
        // No assignRole for 'user'

        // Ensure required records exist for foreign keys
        $propertyType = PropertyType::firstOrCreate(['name' => 'House']);
        $listingMethod = ListingMethod::firstOrCreate(
            ['name' => 'Sale'],
            [
                'slug' => Str::slug('Sale'),
                'display_names' => ['For Sale', 'Sell', 'Selling'], // <-- REMOVE json_encode
                'description' => 'Standard sale method',
            ]
        );
        $listingStatus = ListingStatus::firstOrCreate(['name' => 'Active']);



        // Call other seeders in logical order
        $this->call([
            FeatureSeeder::class,
            CategorySeeder::class,
            PropertyTypeSeeder::class,
            ListingMethodSeeder::class,
            ListingStatusSeeder::class,
            CountrySeeder::class,
            AustralianStatesSeeder::class,
            AustralianSuburbsSeeder::class,
        ]);

        // Seed properties with price using factories
        Property::factory()
            ->count(50)
            ->state([
                'user_id' => $superAdmin->id, // Assign all properties to super admin
                'property_type_id' => $propertyType->id,
                'listing_method_id' => $listingMethod->id,
                'listing_status_id' => $listingStatus->id,
            ])
            ->create();
    }
}
