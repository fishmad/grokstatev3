<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListingStatus;

class ListingStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            'Active',
            'Under Offer',
            'Sold',
            'Leased',
            'Withdrawn',
            'Off Market',
            'Historic',
        ];
        foreach ($statuses as $status) {
            ListingStatus::firstOrCreate(['name' => $status]);
        }
    }
}
