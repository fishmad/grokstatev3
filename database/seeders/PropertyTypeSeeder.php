<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyType;

class PropertyTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'House',
            'Apartment',
            'Townhouse',
            'Villa',
            'Unit',
            'Studio',
            'Granny Flat',
            'Duplex',
            'Penthouse',
            'Land',
        ];
        foreach ($types as $type) {
            PropertyType::firstOrCreate(
                ['name' => $type],
                ['slug' => \Str::slug($type)]
            );
        }
    }
}
