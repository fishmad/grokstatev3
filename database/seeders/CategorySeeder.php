<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryType;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example category types and categories with hierarchy
        $types = [
            'Residential' => [
                'House',
                'Apartment',
                'Townhouse',
                'Villa',
                'Unit',
                'Granny Flat',
                'Studio',
                'Retirement Living',
            ],
            'Commercial' => [
                'Office',
                'Retail',
                'Warehouse',
                'Industrial',
                'Showroom',
                'Medical',
                'Hotel/Leisure',
                'Other Commercial',
            ],
            'Land' => [
                'Residential Land',
                'Commercial Land',
                'Rural Land',
                'Development Site',
            ],
            'Rural' => [
                'Acreage',
                'Farm',
                'Lifestyle',
            ],
            'Business' => [
                'Franchise',
                'Food/Hospitality',
                'Retail',
                'Professional',
                'Other Business',
            ],
        ];

        $type = CategoryType::firstOrCreate(['name' => 'Property']);

        foreach ($types as $parentName => $children) {
            // Custom display_name for 'Land' and 'Business' parents if needed
            $parentDisplayName = $parentName;
            $parentDescription = null;
            if (strtolower($parentName) === 'residential') {
                $parentDisplayName = 'For Sale';
                $parentDescription = 'Properties available for sale.';
            } elseif (strtolower($parentName) === 'commercial') {
                $parentDisplayName = 'For Rent';
                $parentDescription = 'Properties available for rent.';
            }
            $parentSlug = Str::slug($parentName);
            $parentCategory = Category::firstOrCreate([
                'name' => $parentName,
                'display_name' => $parentDisplayName,
                'category_type_id' => $type->id,
                'parent_id' => null,
                'slug' => $parentSlug,
                'description' => $parentDescription,
            ]);

            // Create children
            foreach ($children as $childName) {
                $childDisplayName = $childName;
                $childDescription = null;
                if (strtolower($childName) === 'house') {
                    $childDisplayName = 'House for Sale';
                    $childDescription = 'Standalone residential property for sale.';
                } elseif (strtolower($childName) === 'apartment') {
                    $childDisplayName = 'Apartment for Rent';
                    $childDescription = 'Apartment available for rent.';
                }
                $childSlug = Str::slug($childName);
                $slug = $childSlug;
                $i = 2;
                while (Category::where('slug', $slug)->exists()) {
                    $slug = $childSlug . '-' . $i;
                    $i++;
                }
                Category::firstOrCreate([
                    'name' => $childName,
                    'display_name' => $childDisplayName,
                    'category_type_id' => $type->id,
                    'parent_id' => $parentCategory->id,
                    'slug' => $slug,
                    'description' => $childDescription,
                ]);
            }
        }
    }
}
