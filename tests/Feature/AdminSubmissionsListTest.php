<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSubmissionsListTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_submissions_list_page(): void
    {
        $admin = User::factory()->asAdmin()->create();
        Submission::factory()->pending()->create();

        $response = $this->actingAs($admin)->get(route('admin.submissions'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/submissions')
            ->has('submissions.data', 1)
            ->where('filters.status', 'pending')
        );
    }

    public function test_admin_can_filter_submissions_by_status(): void
    {
        $admin = User::factory()->asAdmin()->create();
        Submission::factory()->pending()->create(['title' => '待审核投稿']);
        Submission::factory()->approved()->create(['title' => '已通过投稿']);

        $response = $this->actingAs($admin)->get(route('admin.submissions', [
            'status' => 'approved',
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/submissions')
            ->has('submissions.data', 1)
            ->where('submissions.data.0.title', '已通过投稿')
            ->where('filters.status', 'approved')
        );
    }
}
