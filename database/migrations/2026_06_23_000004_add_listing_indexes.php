<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->index(['status', 'is_featured', 'sort_order', 'published_at'], 'tutorials_listing_index');
            $table->index('category');
        });

        Schema::table('community_posts', function (Blueprint $table) {
            $table->index(['pinned', 'created_at']);
            $table->index('likes');
            $table->index('views');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->index(['status', 'submitted_at']);
            $table->index(['status', 'reviewed_at']);
        });
    }

    public function down(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->dropIndex('tutorials_listing_index');
            $table->dropIndex(['category']);
        });

        Schema::table('community_posts', function (Blueprint $table) {
            $table->dropIndex(['pinned', 'created_at']);
            $table->dropIndex(['likes']);
            $table->dropIndex(['views']);
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex(['status', 'submitted_at']);
            $table->dropIndex(['status', 'reviewed_at']);
        });
    }
};
