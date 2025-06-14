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
            $table->unsignedBigInteger('country_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
            $table->foreign('state_id')->references('id')->on('states')->onDelete('set null');
            $table->foreignId('suburb_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('region_id')->nullable()->constrained('regions')->onDelete('set null');
            $table->string('address_line_1')->nullable(); // Unit or street address
            $table->string('address_line_2')->nullable(); // Additional address information
            $table->string('postcode')->nullable(); // Postal code
            $table->string('suburb_name')->nullable(); // Suburb Name
            $table->string('state_name')->nullable(); // State Name
            $table->string('country_name')->nullable(); // Country Name
            $table->string('lot_number')->nullable();
            $table->string('unit_number')->nullable();
            $table->string('street_number')->nullable();
            $table->string('street_name')->nullable(); 
            $table->string('street_type')->nullable(); // Type of street (e.g., Street, Avenue, Road)
            $table->string('city_name')->nullable(); // City Sydney 
            $table->string('region_name')->nullable(); // Region name (Council, Shire, etc.)
            $table->boolean('is_unit')->nullable(); // Indicates if the address is a unit or apartment
            $table->boolean('is_lot')->nullable(); // Indicates if the address is a lot
            $table->boolean('is_complex')->nullable(); // Indicates if the address is a complex (e.g., apartment complex, gated community)
            $table->string('complex_number')->nullable(); // Complex number if applicable
            $table->string('complex_street_name')->nullable(); // Complex street name if applicable
            $table->string('complex_name')->nullable();
            $table->string('formatted_address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable(); // added to replace 'latitude'
            $table->decimal('longitude', 11, 8)->nullable(); // added to replace 'longitude'
            $table->boolean('display_address_on_map')->default(true);
            $table->boolean('display_street_view')->default(true);
            $table->boolean('display_full_address')->default(true); // Display my entire address
            $table->boolean('display_suburb_only')->default(false); // Display only my suburb
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
