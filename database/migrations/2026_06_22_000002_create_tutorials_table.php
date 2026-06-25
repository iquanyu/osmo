<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tutorials', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('beginner'); // beginner/cinematic/night/vlog/creative
            $table->string('title');
            $table->text('summary');
            $table->string('difficulty')->default('新手'); // 新手/进阶/大师
            $table->string('duration')->default('5 分钟');
            $table->json('steps')->nullable();
            $table->json('tips')->nullable();
            $table->json('settings')->nullable(); // {resolution, colorProfile, gimbalMode, ndFilter}
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutorials');
    }
};
