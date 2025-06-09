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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('listing_method_id')->constrained()->onDelete('cascade');
            $table->foreignId('listing_status_id')->constrained()->onDelete('cascade');
            $table->boolean('is_free')->default('1'); // Default to true, meaning the property is free to list
            $table->string('status')->default('active'); // Default status
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->integer('beds')->nullable(); // Beds = 0,1,2,3,4,5+
            $table->integer('baths')->nullable(); // Baths = 0,1,2,3,4,5+
            $table->integer('parking_spaces')->nullable(); // Parking spaces = 0,1,2,3,4,5+
            $table->decimal('land_size', 12, 2)->nullable();
            $table->string('land_size_unit', 10)->nullable();
            $table->decimal('building_size', 12, 2)->nullable();
            $table->string('building_size_unit', 10)->nullable();
            $table->integer('ensuites')->nullable(); // Attributes really
            $table->integer('garage_spaces')->nullable(); // Attributes really
            $table->json('dynamic_attributes')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
