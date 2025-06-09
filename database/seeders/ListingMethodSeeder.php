<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListingMethod;
use Illuminate\Support\Str;

class ListingMethodSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n[ListingMethodSeeder] Running ListingMethodSeeder...\n";

        $methods = [
            [
                'name' => 'Sale',
                'display_names' => ['For Sale', 'Sell', 'Selling'],
                'description' => 'Standard sale method',
            ],
            [
                'name' => 'Rent',
                'display_names' => ['For Rent', 'Rental', 'Lease'],
                'description' => 'Standard rental method',
            ],
            [
                'name' => 'Auction',
                'display_names' => ['Auction'],
                'description' => 'Auction method',
            ],
            [
                'name' => 'Lease',
                'display_names' => ['Lease'],
                'description' => 'Leasing method',
            ],
            [
                'name' => 'Tender',
                'display_names' => ['Tender'],
                'description' => 'Tender method',
            ],
            [
                'name' => 'Expression of Interest',
                'display_names' => ['EOI', 'Expression of Interest'],
                'description' => 'Expression of Interest method',
            ],
        ];
        foreach ($methods as $method) {
            $slug = Str::slug($method['name']);
            ListingMethod::firstOrCreate(
                ['name' => $method['name']],
                [
                    'slug' => $slug,
                    'display_names' => $method['display_names'],
                    'description' => $method['description'],
                ]
            );
        }
    }
}
