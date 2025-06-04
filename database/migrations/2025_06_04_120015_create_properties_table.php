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
            $table->timestamps();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('listing_method_id')->constrained()->onDelete('cascade');
            $table->foreignId('listing_status_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('beds')->nullable();
            $table->integer('baths')->nullable();
            $table->integer('parking_spaces')->nullable();
            $table->integer('land_size_sqm')->nullable();
            $table->integer('building_size_sqm')->nullable();
            $table->integer('ensuites')->nullable();
            $table->integer('garage_spaces')->nullable();
            $table->json('dynamic_attributes')->nullable();
            $table->boolean('is_free')->default(false);
            $table->dateTime('expires_at')->nullable();
            $table->string('slug')->unique();
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
