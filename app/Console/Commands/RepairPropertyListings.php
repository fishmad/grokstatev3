<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Property;
use App\Models\Listing;
use Illuminate\Support\Arr;

class RepairPropertyListings extends Command
{
    protected $signature = 'property:repair-listings';
    protected $description = 'Ensure every property has a listing with a valid listing_type.';

    public function handle()
    {
        $listingTypes = [
            'sale',
            'rent',
            'auction',
            'holiday letting',
            'swap',
            'share',
            'new development',
            'tender',
            'off-market',
            'foreclosure',
            'commercial lease',
            'eoi',
        ];
        $packageTypes = ['free', 'basic_paid', 'featured_category', 'featured_location', 'sponsored'];
        $statuses = ['draft', 'available', 'tba', 'off_market'];
        $userIds = \App\Models\User::pluck('id')->toArray();
        $i = 0;
        $fixed = 0;
        foreach (Property::doesntHave('listing')->get() as $property) {
            $listingType = $listingTypes[$i % count($listingTypes)];
            $packageType = Arr::random($packageTypes);
            $status = Arr::random($statuses);
            $userId = $property->user_id ?? Arr::random($userIds);
            Listing::create([
                'property_id' => $property->id,
                'user_id' => $userId,
                'listing_type' => $listingType,
                'package_type' => $packageType,
                'image_limit' => 5,
                'allow_physical_signage' => false,
                'is_active' => true,
                'is_featured' => false,
                'expires_at' => now()->addMonths(3),
                'status' => $status,
                'published_at' => now(),
            ]);
            $i++;
            $fixed++;
        }
        $this->info("Added $fixed missing listings.");
        return 0;
    }
}
