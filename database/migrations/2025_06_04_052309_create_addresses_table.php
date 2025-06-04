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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('suburb_id')->nullable()->constrained()->onDelete('set null');
            $table->string('street_number')->nullable();
            $table->string('street_name');
            $table->string('unit_number')->nullable();
            $table->string('lot_number')->nullable();
            $table->string('site_name')->nullable();
            $table->string('region_name')->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('long', 11, 8)->nullable();
            $table->boolean('display_address_on_map')->default(true);
            $table->boolean('display_street_view')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
