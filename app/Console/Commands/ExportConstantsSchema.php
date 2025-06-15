<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Constant;
use Illuminate\Support\Facades\File;

class ExportConstantsSchema extends Command
{
    protected $signature = 'constants:export-schema';
    protected $description = 'Export canonical constants to JSON schema file';

    public function handle()
    {
        // Optionally filter by category or is_active
        $constants = Constant::where('is_active', true)->get();

        $schema = [];
        foreach ($constants as $constant) {
            // Always decode JSON value once
            $decoded = is_array($constant->value) ? $constant->value : json_decode($constant->value, true);
            $schema[$constant->key] = $decoded;
        }

        $path = resource_path('js/schema/property-fields.schema.json');
        File::put($path, json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $this->info('Schema exported to ' . $path);
    }
}
