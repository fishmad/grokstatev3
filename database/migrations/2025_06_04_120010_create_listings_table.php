<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            // This creates the foreign key relationship
            $table->foreignId('address_id')->constrained()->onDelete('cascade');
            $table->enum('listing_type', ['sale', 'rent']);
            $table->decimal('price', 12, 2);
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'under_offer', 'sold', 'rented', 'withdrawn']);
            $table->date('listed_on');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
