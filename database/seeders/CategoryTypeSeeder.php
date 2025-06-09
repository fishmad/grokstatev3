<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategoryType;

class CategoryTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "\n[CategoryTypeSeeder] Running CategoryTypeSeeder...\n";
        // Ensure a CategoryType with id=1 exists
        CategoryType::firstOrCreate([
            'id' => 1
        ], [
            'name' => 'Default',
            'slug' => 'default',
        ]);
        // Add more types as needed
        CategoryType::firstOrCreate([
            'name' => 'Property'
        ], [
            'slug' => 'property',
        ]);
    }
}
