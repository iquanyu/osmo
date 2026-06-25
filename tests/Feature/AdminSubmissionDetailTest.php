<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSubmissionDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_submission_detail_page(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $submission = Submission::factory()->pending()->create([
            'title' => '详情页测试投稿',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.submissions.show', $submission));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/submission-detail')
            ->where('submission.id', $submission->id)
            ->where('submission.title', '详情页测试投稿')
            ->has('queueMeta')
        );
    }

    public function test_player_cannot_access_submission_detail_page(): void
    {
        $player = User::factory()->create();
        $submission = Submission::factory()->pending()->create();

        $response = $this->actingAs($player)->get(route('admin.submissions.show', $submission));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error', '无权访问，仅管理员可操作');
    }
}
