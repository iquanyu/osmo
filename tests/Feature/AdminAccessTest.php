<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_admin_cannot_access_admin_pages(): void
    {
        $admin = User::factory()->asAdmin()->unverified()->create();

        $response = $this->actingAs($admin)->get(route('admin.index'));

        $response->assertRedirect(route('verification.notice'));
    }

    public function test_disabled_admin_is_redirected_to_login_when_accessing_admin_pages(): void
    {
        $admin = User::factory()->asAdmin()->create([
            'login_disabled_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get(route('admin.index'));

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('error', '账号已被禁用');
        $this->assertGuest();
    }

    public function test_player_users_cannot_access_admin_pages(): void
    {
        $player = User::factory()->create();

        $response = $this->actingAs($player)->get(route('admin.index'));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error', '无权访问，仅管理员可操作');
    }

    public function test_player_users_cannot_access_admin_submission_detail_pages(): void
    {
        $player = User::factory()->create();
        $submission = Submission::factory()->create([
            'status' => 'pending',
        ]);

        $response = $this->actingAs($player)->get(route('admin.submissions.show', $submission));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error', '无权访问，仅管理员可操作');
    }
}
