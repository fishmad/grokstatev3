<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePricesTable extends Migration
{
    public function up(): void
    {
        Schema::create('prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->unique()->comment('One-to-one with properties table');
            $table->string('price_type')->default('sale')->comment('sale, rent_weekly, rent_monthly, rent_yearly, offers_above, offers_between, enquire, contact, call, negotiable, fixed, tba');
            $table->decimal('amount', 15, 2)->nullable()->comment('Primary numeric amount, e.g., 500000.00');
            $table->decimal('range_min', 15, 2)->nullable()->comment('Minimum for offers_between');
            $table->decimal('range_max', 15, 2)->nullable()->comment('Maximum for offers_between');
            $table->string('label')->nullable()->comment('Display text, e.g., "Offers above $400,000"');
            $table->boolean('hide_amount')->default(false)->comment('Hide numeric amount, show label');
            $table->boolean('penalize_search')->default(false)->comment('Penalize in search/sort if non-numeric or hidden');
            $table->boolean('display')->default(true)->comment('Show price on listing');
            $table->string('tax')->default('unknown')->comment('unknown, exempt, inclusive, exclusive');
            $table->timestamps();

            $table->foreign('property_id')
                  ->references('id')
                  ->on('properties')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prices');
    }
}