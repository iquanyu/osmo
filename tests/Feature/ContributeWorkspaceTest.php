<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContributeWorkspaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_player_can_access_contribute_workspace(): void
    {
        $user = User::factory()->create();
        Submission::factory()->draft()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('contribute.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('contribute/index')
            ->has('submissions', 1)
            ->where('stats.draft', 1)
            ->where('filters.status', 'all')
        );
    }

    public function test_unverified_player_is_redirected_from_contribute_workspace(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get(route('contribute.index'));

        $response->assertRedirect(route('verification.notice'));
    }

    public function test_disabled_player_is_redirected_to_login_from_contribute_workspace(): void
    {
        $user = User::factory()->create([
            'login_disabled_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('contribute.index'));

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('error', '账号已被禁用');
        $this->assertGuest();
    }

    public function test_player_can_filter_submissions_by_status(): void
    {
        $user = User::factory()->create();
        Submission::factory()->draft()->create([
            'user_id' => $user->id,
            'title' => '草稿投稿',
        ]);
        Submission::factory()->pending()->create([
            'user_id' => $user->id,
            'title' => '审核中投稿',
        ]);

        $response = $this->actingAs($user)->get(route('contribute.index', [
            'status' => 'pending',
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('submissions', 1)
            ->where('submissions.0.title', '审核中投稿')
            ->where('stats.draft', 1)
            ->where('stats.pending', 1)
            ->where('filters.status', 'pending')
        );
    }

    public function test_player_only_sees_their_own_submissions(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Submission::factory()->create([
            'user_id' => $user->id,
            'title' => '我的投稿',
        ]);
        Submission::factory()->create([
            'user_id' => $other->id,
            'title' => '别人的投稿',
        ]);

        $response = $this->actingAs($user)->get(route('contribute.index'));

        $response->assertInertia(fn ($page) => $page
            ->has('submissions', 1)
            ->where('submissions.0.title', '我的投稿')
        );
    }

    public function test_approved_submissions_include_published_tutorial_relation(): void
    {
        $user = User::factory()->create();
        $tutorial = Tutorial::create([
            'category' => 'beginner',
            'title' => '玩家投稿已发布教程',
            'summary' => '简介',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => '跟随 (Follow)',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/cover.jpg',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
        ]);

        Submission::factory()->approved()->create([
            'user_id' => $user->id,
            'title' => '已通过投稿',
            'published_tutorial_id' => $tutorial->id,
        ]);

        $response = $this->actingAs($user)->get(route('contribute.index', [
            'status' => 'approved',
        ]));

        $response->assertInertia(fn ($page) => $page
            ->where('submissions.0.published_tutorial.title', '玩家投稿已发布教程')
            ->where('submissions.0.published_tutorial_id', $tutorial->id)
        );
    }

    public function test_player_can_delete_draft_submission(): void
    {
        $user = User::factory()->create();
        $submission = Submission::factory()->draft()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->delete(
            route('contribute.destroy', $submission),
        );

        $response->assertRedirect();
        $this->assertDatabaseMissing('submissions', ['id' => $submission->id]);
    }

    public function test_player_cannot_delete_pending_submission(): void
    {
        $user = User::factory()->create();
        $submission = Submission::factory()->pending()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->delete(
            route('contribute.destroy', $submission),
        );

        $response->assertForbidden();
    }
}
