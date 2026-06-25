<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type')->default('tutorial'); // tutorial|preset|video (预留扩展)
            $table->string('status')->default('draft');  // draft|pending|approved|rejected
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('details')->nullable(); // 教程专属：steps/tips/settings/difficulty/duration/category
            $table->text('review_note')->nullable(); // 运营驳回理由
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('published_tutorial_id')->nullable()->constrained('tutorials')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
