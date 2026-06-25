<?php

namespace Tests\Feature;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * 验收：管理员登录 → 审一条稿 → 前台教程库可见
 */
class AdminApprovalAcceptanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_approve_submission_and_public_tutorials_show_it(): void
    {
        $admin = User::factory()->asAdmin()->create([
            'email' => 'admin-acceptance@osmo.local',
            'password' => bcrypt('password'),
        ]);
        $player = User::factory()->create(['email' => 'player-acceptance@osmo.local']);

        $uniqueTitle = '【验收】管理员审核后前台可见教程';

        $submission = Submission::factory()->pending()->create([
            'user_id' => $player->id,
            'title' => $uniqueTitle,
            'summary' => '端到端验收用投稿摘要。',
        ]);

        $this->assertSame(0, Tutorial::where('title', $uniqueTitle)->count());

        // 1. 管理员进入后台
        $this->actingAs($admin)
            ->get(route('admin.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/index'));

        // 2. 投稿列表可见待审条目
        $this->actingAs($admin)
            ->get(route('admin.submissions'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/submissions')
                ->has('submissions.data', fn ($rows) => $rows
                    ->where('0.title', $uniqueTitle)
                    ->etc()
                )
            );

        // 3. 投稿详情页
        $this->actingAs($admin)
            ->get(route('admin.submissions.show', $submission))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/submission-detail')
                ->where('submission.title', $uniqueTitle)
                ->where('submission.status', SubmissionStatus::Pending->value)
            );

        // 4. 通过审核
        $this->actingAs($admin)
            ->post(route('admin.submissions.approve', $submission))
            ->assertRedirect();

        $submission->refresh();
        $tutorial = Tutorial::query()->where('title', $uniqueTitle)->first();

        $this->assertNotNull($tutorial);
        $this->assertSame(SubmissionStatus::Approved, $submission->status);
        $this->assertSame('published', $tutorial->status);
        $this->assertSame($tutorial->id, $submission->published_tutorial_id);

        // 5. 前台教程库（无需登录）可见
        $this->get(route('tutorials.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('tutorials/index')
                ->has('tutorials.data', fn ($tutorials) => $tutorials
                    ->where('0.title', $uniqueTitle)
                    ->etc()
                )
            );
    }
}
