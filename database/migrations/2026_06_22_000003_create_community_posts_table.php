<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_posts', function (Blueprint $table) {
            $table->id();
            $table->string('author')->default('热心飞友');
            $table->string('avatar_color')->default('bg-blue-500');
            $table->string('title');
            $table->text('content');
            $table->json('tags')->nullable();
            $table->integer('likes')->default(0);
            $table->integer('views')->default(0);
            $table->boolean('pinned')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_posts');
    }
};
