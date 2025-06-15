<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ConstantSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $faker = Faker::create();
        DB::table('constants')->insertOrIgnore([
            [
                'key' => 'listing_types',
                'value' => json_encode([
                    ["value" => "sale", "label" => "For Sale", "color" => "bg-blue-600"],
                    ["value" => "rent", "label" => "For Rent", "color" => "bg-green-600"],
                    ["value" => "auction", "label" => "Auction", "color" => "bg-orange-600"],
                    ["value" => "holiday-letting", "label" => "Holiday Letting", "color" => "bg-pink-600"],
                    ["value" => "swap", "label" => "Swap", "color" => "bg-cyan-600"],
                    ["value" => "share", "label" => "Share", "color" => "bg-purple-600"],
                    ["value" => "new-development", "label" => "New Development", "color" => "bg-yellow-600 text-black"],
                    ["value" => "tender", "label" => "Tender", "color" => "bg-teal-600"],
                    ["value" => "off-market", "label" => "Off Market", "color" => "bg-gray-600"],
                    ["value" => "foreclosure", "label" => "Foreclosure", "color" => "bg-red-700"],
                    ["value" => "commercial-lease", "label" => "Commercial Lease", "color" => "bg-indigo-600"],
                    ["value" => "eoi", "label" => "EOI", "color" => "bg-violet-700"],
                ]),
                'description' => 'Allowed listing types.',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            [
                'key' => 'property_types',
                'value' => json_encode(
                    [
                        'house', 
                        'apartment', 
                        'land', 
                        'rural', 
                        'commercial', 
                        'other'
                    ]
                ),
                'description' => 'Allowed property types.',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'property_sub_types',
                'value' => json_encode(
                    [
                        'single_family',
                        'villa',
                        'duplex',
                        'terrace_house',
                        'apartment_unit',
                        'condominium',
                        'townhouse',
                        'granny_flat',
                        'development_site',
                        'office',
                        'retail',
                        'warehouse',
                        'farm',
                        'lifestyle_property',
                        'holiday_home',
                        'motel_hotel',
                        'studio',
                        'penthouse',
                        'car_space',
                        'land',
                        'semi_detached',
                        'cottage',
                        'bungalow',
                        'loft',
                        'shed',
                        'storage_unit',
                        'other'
                    ]
                ),
                'description' => 'Allowed property sub-types.',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'key' => 'statuses',
                'value' => json_encode(
                    [
                        'available', 
                        'sold', 
                        'rented', 
                        'leased', 
                        'withdrawn', 
                        'under_contract', 
                        'in_negotiations', 
                        'off_market', 
                        'tba', 
                        'pending', 
                        'draft'
                    ]
                ),
                'description' => 'Allowed property statuses.',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],


            [
                'key' => 'area_units',
                'value' => json_encode(
                    [
                        'sqm', 
                        'sqft', 
                        'acre', 
                        'hectare'
                    ]
                ),
                'description' => 'Allowed area units for property land/floor area.',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'floor_area_units',
                'value' => json_encode(['sqm', 'sqft']),
                'description' => 'Allowed floor area units',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'max_year_built',
                'value' => json_encode(date('Y') + 1),
                'description' => 'Maximum year for year built dropdown.',
                'usage' => 'property forms, validation',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'min_year_built',
                'value' => json_encode(1800),
                'description' => 'Minimum year for year built dropdown.',
                'usage' => 'property forms, validation',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            [
                'key' => 'area_units',
                'value' => json_encode(['sqm', 'sqft']),
                'description' => 'Allowed area units for apartments',
                'usage' => 'apartment property forms',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'max_year_built',
                'value' => json_encode(date('Y') + 1),
                'description' => 'Maximum year for year built dropdown',
                'usage' => 'global property forms',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'min_year_built',
                'value' => json_encode(1850),
                'description' => 'Minimum year for year built dropdown',
                'usage' => 'global property forms',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],

            [
                'key' => 'status',
                'value' => json_encode($faker->randomElement(['active', 'inactive'])),
                'description' => 'User status options',
                'usage' => 'user management, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'state',
                'value' => json_encode(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']),
                'description' => 'Australian states and territories.',
                'usage' => 'property forms, validation, address fields',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'address_fields',
                'value' => json_encode([
                    'address_line_1',
                    'address_line_2',
                    'suburb',
                    'state',
                    'postcode',
                    'country',
                    'traditional_place_name',
                    'po_box'
                ]),
                'description' => 'Canonical address fields for properties.',
                'usage' => 'property forms, validation, address fields',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'parking_spaces',
                'value' => json_encode(range(0, 10)),
                'description' => 'Allowed values for parking spaces (0-10).',
                'usage' => 'StorePropertyRequest, UpdatePropertyRequest, property forms, admin UI',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
