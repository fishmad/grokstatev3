<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('property_agent', function (Blueprint $table) {
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('agent_order')->default(1);
            $table->boolean('receive_campaign_report')->default(true);
            $table->primary(['property_id', 'user_id']);
        });
    }
    public function down()
    {
        Schema::dropIfExists('property_agent');
    }
};
