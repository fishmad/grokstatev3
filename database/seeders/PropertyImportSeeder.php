<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\Media;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class PropertyImportSeeder extends Seeder
{
    public function run()
    {
        // 1. Load all CSVs into arrays
        $listings = $this->csvToArray(database_path('Conversion/other_en_listingsdb.csv'));
        $users = $this->csvToArray(database_path('Conversion/other_en_userdb.csv'));
        $details = $this->csvToArray(database_path('Conversion/other_en_listingsdbelements.csv'));
        $images = $this->csvToArray(database_path('Conversion/other_en_listingsimages.csv'));
        $categories = $this->csvToArray(database_path('Conversion/other_en_class.csv'));
        $classlistings = $this->csvToArray(database_path('Conversion/other_classlistingsdb.csv'));

        // 2. Index users, details, images, categories, classlistings by their IDs for fast lookup
        $usersById = collect($users)->keyBy('userdb_id');
        $detailsByListing = collect($details)->groupBy('listingsdb_id');
        $imagesByListing = collect($images)->groupBy('listingsdb_id');
        $categoriesById = collect($categories)->keyBy('class_id');
        $classlistingsByListing = collect($classlistings)->groupBy('listingsdb_id');

        // 3. Import properties
        foreach ($listings as $row) {
            // Find or create user
            $user = $usersById[$row['userdb_id']] ?? null;
            $userId = $user ? $row['userdb_id'] : null; // Or create a fallback user

            // Map details
            $propertyDetails = $detailsByListing[$row['listingsdb_id']] ?? collect();
            $attributes = [];
            foreach ($propertyDetails as $detail) {
                $attributes[$detail['listingsdbelements_field_name']] = $detail['listingsdbelements_field_value'];
            }

            // Create property (map only to actual Laravel schema fields)
            $property = Property::create([
                'user_id' => $userId,
                'title' => $row['listingsdb_title'],
                'description' => $attributes['full_desc'] ?? $row['listingsdb_notes'],
                'created_at' => $row['listingsdb_creation_date'],
                'updated_at' => $row['listingsdb_last_modified'],
                'expires_at' => $row['listingsdb_expiration'],
                'views' => $row['listingsdb_hit_count'],
                'is_featured' => $row['listingsdb_featured'] === 'yes',
                'is_active' => $row['listingsdb_active'] === 'yes',
                'beds' => $attributes['beds'] ?? null,
                'baths' => $attributes['baths'] ?? null,
                'parking_spaces' => $attributes['garage_size'] ?? null,
                'land_size' => $attributes['lot_size'] ?? null,
                'land_size_unit' => 'sqm',
                'building_size' => $attributes['sq_mtr'] ?? null,
                'building_size_unit' => 'sqm',
                'address_line_1' => $attributes['address'] ?? null,
                'suburb' => $attributes['town'] ?? null,
                'state' => $attributes['state'] ?? null,
                'postcode' => $attributes['postcode'] ?? null,
                'country' => $attributes['country'] ?? null,
                'year_built' => $attributes['year_built'] ?? null,
                'dynamic_attributes' => json_encode($attributes),
            ]);

            // Attach images (Media)
            $propertyImages = $imagesByListing[$row['listingsdb_id']] ?? collect();
            foreach ($propertyImages as $img) {
                Media::create([
                    'property_id' => $property->id,
                    'file_name' => $img['listingsimages_file_name'],
                    'thumb_file_name' => $img['listingsimages_thumb_file_name'],
                    'caption' => $img['listingsimages_caption'],
                    'rank' => $img['listingsimages_rank'],
                    'type' => 'image',
                ]);
            }

            // Attach categories (property classes) using Laravel pivot table
            $classIds = $classlistingsByListing[$row['listingsdb_id']]?->pluck('class_id')->toArray() ?? [];
            $categoryIds = [];
            foreach ($classIds as $classId) {
                if (isset($categoriesById[$classId])) {
                    $category = Category::firstOrCreate([
                        'name' => $categoriesById[$classId]['class_name'],
                    ], [
                        'rank' => $categoriesById[$classId]['class_rank'],
                        'slug' => \Str::slug($categoriesById[$classId]['class_name']),
                    ]);
                    $categoryIds[] = $category->id;
                }
            }
            if (!empty($categoryIds)) {
                $property->categories()->sync($categoryIds);
            }
        }
    }

    private function csvToArray($filename)
    {
        $rows = [];
        if (!file_exists($filename)) {
            return $rows;
        }
        if (($handle = fopen($filename, 'r')) !== false) {
            $header = null;
            while (($data = fgetcsv($handle, 10000, ',')) !== false) {
                if (!$header) {
                    $header = $data;
                } else {
                    $rows[] = array_combine($header, $data);
                }
            }
            fclose($handle);
        }
        return $rows;
    }
}
