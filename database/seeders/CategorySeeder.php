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
            // Create parent category
            $parentSlug = Str::slug($parentName);
            $parentCategory = Category::firstOrCreate([
                'name' => $parentName,
                'category_type_id' => $type->id,
                'parent_id' => null,
                'slug' => $parentSlug,
            ]);

            // Create children
            foreach ($children as $childName) {
                $childSlug = Str::slug($childName);
                $slug = $childSlug;
                $i = 2;
                while (Category::where('slug', $slug)->exists()) {
                    $slug = $childSlug . '-' . $i;
                    $i++;
                }
                Category::firstOrCreate([
                    'name' => $childName,
                    'category_type_id' => $type->id,
                    'parent_id' => $parentCategory->id,
                    'slug' => $slug,
                ]);
            }
        }
    }
}
