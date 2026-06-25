<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\AdminOverviewService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOverviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_overview_page(): void
    {
        $admin = User::factory()->asAdmin()->create();

        $response = $this->actingAs($admin)->get(route('admin.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/index')
            ->has('stats', fn ($stats) => $stats
                ->has('tutorialCount')
                ->has('publishedTutorialCount')
                ->has('draftTutorialCount')
                ->has('featuredTutorialCount')
                ->has('postCount')
                ->has('totalLikes')
                ->has('totalAnswers')
                ->has('pinnedCount')
                ->has('pendingSubmissionCount')
            )
            ->has('weeklyTrend', 7)
            ->where('canResetDemoData', app()->environment('local'))
        );
    }

    public function test_weekly_trend_returns_seven_days_of_operational_data(): void
    {
        $service = app(AdminOverviewService::class);
        $trend = $service->getWeeklyTrend();

        $this->assertCount(7, $trend);
        $this->assertArrayHasKey('day', $trend[0]);
        $this->assertArrayHasKey('tutorials', $trend[0]);
        $this->assertArrayHasKey('submissions', $trend[0]);
        $this->assertArrayHasKey('communityPosts', $trend[0]);
        $this->assertArrayHasKey('reviews', $trend[0]);
    }

    public function test_overview_stats_use_efficient_answer_count(): void
    {
        $service = app(AdminOverviewService::class);
        $stats = $service->getStats();

        $this->assertArrayHasKey('featuredTutorialCount', $stats);
        $this->assertArrayHasKey('totalAnswers', $stats);
        $this->assertSame(0, $stats['totalAnswers']);
    }
}
