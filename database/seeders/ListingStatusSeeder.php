<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListingStatus;
use Illuminate\Support\Str;

class ListingStatusSeeder extends Seeder
{
    public function run(): void
    {
        // Backfill missing slugs for existing records
        foreach (ListingStatus::whereNull('slug')->orWhere('slug', '')->get() as $status) {
            $status->slug = Str::slug($status->name);
            $status->save();
        }

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
            ListingStatus::updateOrCreate(
                ['name' => $status],
                ['slug' => Str::slug($status)]
            );
        }
    }
}
