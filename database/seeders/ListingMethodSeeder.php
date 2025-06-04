<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListingMethod;

class ListingMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            'Sale',
            'Auction',
            'For Rent',
            'Lease',
            'Tender',
            'Expression of Interest',
        ];
        foreach ($methods as $method) {
            ListingMethod::firstOrCreate(['name' => $method]);
        }
    }
}
