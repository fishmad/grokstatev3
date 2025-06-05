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
        // Unique constraint for countries.name
        Schema::table('countries', function (Blueprint $table) {
            $table->unique('name');
        });
        // Unique constraint for states (name, country_id)
        Schema::table('states', function (Blueprint $table) {
            $table->unique(['name', 'country_id']);
        });
        // Unique constraint for suburbs (name, postcode, state_id)
        Schema::table('suburbs', function (Blueprint $table) {
            $table->unique(['name', 'postcode', 'state_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('countries', function (Blueprint $table) {
            $table->dropUnique(['name']);
        });
        Schema::table('states', function (Blueprint $table) {
            $table->dropUnique(['states_name_country_id_unique']);
        });
        Schema::table('suburbs', function (Blueprint $table) {
            $table->dropUnique(['suburbs_name_postcode_state_id_unique']);
        });
    }
};
