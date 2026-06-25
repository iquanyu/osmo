<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_is_forbidden_outside_local_environment(): void
    {
        $admin = User::factory()->asAdmin()->create();

        $response = $this->actingAs($admin)->post(route('admin.reset'));

        $response->assertForbidden();
    }

    public function test_admin_can_reset_demo_data_in_local_environment(): void
    {
        $this->withoutMiddleware();

        $admin = User::factory()->asAdmin()->create();
        Tutorial::create([
            'category' => 'beginner',
            'title' => '待清空教程',
            'summary' => '测试',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => '跟随 (Follow)',
                'ndFilter' => '无',
            ],
            'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            'status' => 'published',
        ]);
        CommunityPost::create([
            'author' => '测试',
            'avatar_color' => 'bg-red-500',
            'title' => '待清空帖子',
            'content' => '内容',
            'tags' => ['测试'],
            'likes' => 0,
            'views' => 1,
            'pinned' => false,
        ]);

        $this->app->detectEnvironment(fn () => 'local');

        $response = $this
            ->actingAs($admin)
            ->post(route('admin.reset'));

        $response->assertRedirect(route('admin.index'));
        $this->assertDatabaseMissing('tutorials', ['title' => '待清空教程']);
        $this->assertDatabaseMissing('community_posts', ['title' => '待清空帖子']);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'demo_data_reset',
            'user_id' => $admin->id,
            'message' => '恢复了演示数据',
        ]);
    }
}
