<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('area_units', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Square Meter', 'Acre', 'Hectare'
            $table->string('display_name')->nullable(); // e.g., 'Square Meter', 'Acre', 'Hectare'
            $table->string('code')->unique(); // e.g., 'sqm', 'acre', 'ha'
            $table->string('unit_system')->default('metric'); // e.g., 'metric', 'imperial'
            $table->string('unit_type')->default('area'); // e.g., 'area', 'length', 'volume'
            $table->boolean('is_active')->default(true); // Indicates if the area unit is active
            $table->boolean('is_default')->default(false); // Indicates if this is the default area unit
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('area_units');
    }
};
