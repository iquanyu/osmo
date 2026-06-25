<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserAndLogManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_user_management_page(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $target = User::factory()->create(['name' => '普通玩家']);

        ActivityLog::create([
            'user_id' => $target->id,
            'action' => 'user_role_updated',
            'message' => '将用户角色更新为 player',
            'context' => ['previous_role' => 'player', 'next_role' => 'player'],
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.users'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/users')
            ->has('users.data', 2)
            ->where('recentLogsByUser.'.$target->id.'.0.message', '将用户角色更新为 player')
        );
    }

    public function test_admin_can_update_user_role_and_log_it(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $player = User::factory()->create(['name' => '待升级用户']);

        $response = $this->actingAs($admin)->patch(route('admin.users.role', $player), [
            'role' => 'admin',
        ]);

        $response->assertRedirect();

        $player->refresh();
        $this->assertSame('admin', $player->role);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'user_role_updated',
            'subject_id' => $player->id,
        ]);
    }

    public function test_admin_can_reset_user_password_and_log_it(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $player = User::factory()->create(['name' => '待重置用户']);
        $originalPassword = $player->password;

        $response = $this->actingAs($admin)->patch(route('admin.users.role', $player), [
            'role' => $player->role,
            'mode' => 'password',
        ]);

        $response->assertRedirect();

        $player->refresh();
        $this->assertNotSame($originalPassword, $player->password);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'user_password_reset',
            'subject_id' => $player->id,
        ]);
    }

    public function test_admin_can_disable_and_enable_user_login_with_logs(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $player = User::factory()->create(['name' => '待禁用用户']);

        $disableResponse = $this->actingAs($admin)->patch(route('admin.users.role', $player), [
            'role' => $player->role,
            'mode' => 'disable',
        ]);

        $disableResponse->assertRedirect();

        $player->refresh();
        $this->assertNotNull($player->login_disabled_at);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'user_login_disabled',
            'subject_id' => $player->id,
        ]);

        $enableResponse = $this->actingAs($admin)->patch(route('admin.users.role', $player), [
            'role' => $player->role,
            'mode' => 'enable',
        ]);

        $enableResponse->assertRedirect();

        $player->refresh();
        $this->assertNull($player->login_disabled_at);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'user_login_enabled',
            'subject_id' => $player->id,
        ]);
    }

    public function test_admin_can_view_activity_logs_page(): void
    {
        $admin = User::factory()->asAdmin()->create();

        ActivityLog::create([
            'user_id' => $admin->id,
            'action' => 'user_role_updated',
            'message' => '将用户 A 角色从 player 调整为 admin',
            'context' => ['previous_role' => 'player', 'next_role' => 'admin'],
            'ip_address' => '127.0.0.1',
        ]);

        $response = $this->actingAs($admin)->get(route('admin.logs'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/logs')
            ->has('logs.data', 1)
            ->where('stats.currentPageLogs', 1)
            ->where('filters.action', 'all')
        );
    }
}
