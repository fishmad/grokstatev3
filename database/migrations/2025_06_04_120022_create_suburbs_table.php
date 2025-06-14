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
        Schema::create('suburbs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('state_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('postcode');
            $table->string('slug')->unique();
            $table->decimal('latitude', 10, 8)->nullable(); // Latitude for geolocation
            $table->decimal('longitude', 11, 8)->nullable(); // Longitude for geolocation
            $table->string('locality')->nullable(); // Optional locality field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suburbs');
    }
};
