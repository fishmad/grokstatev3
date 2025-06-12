<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Feature;
use App\Models\FeatureGroup;
use Illuminate\Support\Facades\DB;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define feature groups and their features
        $groups = [
            'Outdoor' => [
                'Swimming Pool', 'Garden', 'Balcony', 'Deck', 'Outdoor Kitchen', 'Shed', 'Tennis Court', 'Granny Flat',
            ],
            'Indoor' => [
                'Air Conditioning', 'Fireplace', 'Home Theatre', 'Smart Home', 'Sauna', 'Gym', 'Wine Cellar',
            ],
            'Security' => [
                'Security System', 'Wheelchair Access',
            ],
            'Parking' => [
                'Garage', 'Carport', 'Off-street Parking',
            ],
            'Luxury' => [
                'Spa', 'Solar Panels',
            ],
            'Workshop' => [
                'Workshop',
            ],
        ];

        // Seed feature groups and features, and attach features to groups
        foreach ($groups as $groupName => $features) {
            $group = FeatureGroup::firstOrCreate(['name' => $groupName]);
            foreach ($features as $featureName) {
                $feature = Feature::firstOrCreate(['name' => $featureName]);
                // Attach feature to group (many-to-many)
                DB::table('feature_group_feature')->updateOrInsert([
                    'feature_group_id' => $group->id,
                    'feature_id' => $feature->id,
                ]);
            }
        }
    }
}
