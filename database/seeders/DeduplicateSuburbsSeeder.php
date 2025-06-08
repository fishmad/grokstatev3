<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Suburb;


class DeduplicateSuburbsSeeder extends Seeder
{
    public function run(): void
    {
        // Find duplicates by name (case-insensitive), state_id, postcode
        $duplicates = Suburb::select('name', 'state_id', 'postcode', DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('LOWER(name)'), 'state_id', 'postcode')
            ->having('count', '>', 1)
            ->get();

        foreach ($duplicates as $dup) {
            $subs = Suburb::whereRaw('LOWER(name) = ?', [strtolower($dup->name)])
                ->where('state_id', $dup->state_id)
                ->where('postcode', $dup->postcode)
                ->orderBy('id')
                ->get();
            $keep = $subs->first();
            $toDelete = $subs->slice(1);
            // Reassign addresses to the kept suburb
            foreach ($toDelete as $suburb) {
                DB::table('addresses')->where('suburb_id', $suburb->id)->update(['suburb_id' => $keep->id]);
                $suburb->delete();
            }
        }
    }
}
