<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->string('status')->default('published')->after('image');
            $table->unsignedInteger('sort_order')->default(0)->after('status');
            $table->boolean('is_featured')->default(false)->after('sort_order');
            $table->timestamp('published_at')->nullable()->after('is_featured');
        });

        DB::table('tutorials')
            ->whereNull('published_at')
            ->update([
                'status' => 'published',
                'published_at' => now(),
            ]);
    }

    public function down(): void
    {
        Schema::table('tutorials', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'sort_order',
                'is_featured',
                'published_at',
            ]);
        });
    }
};
