<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('feature_group_feature', function (Blueprint $table) {
            $table->foreignId('feature_group_id')->constrained()->onDelete('cascade');
            $table->foreignId('feature_id')->constrained()->onDelete('cascade');
            $table->primary(['feature_group_id', 'feature_id']);
        });
    }
    public function down()
    {
        Schema::dropIfExists('feature_group_feature');
    }
};
