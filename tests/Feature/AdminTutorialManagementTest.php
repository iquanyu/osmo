<?php

namespace Tests\Feature;

use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTutorialManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_tutorial(): void
    {
        $admin = User::factory()->asAdmin()->create();

        $payload = $this->validTutorialPayload();

        $response = $this->actingAs($admin)->post(route('admin.tutorials.store'), $payload);

        $response->assertRedirect(route('admin.tutorials'));

        $this->assertDatabaseHas('tutorials', [
            'title' => $payload['title'],
            'status' => 'published',
        ]);
    }

    public function test_admin_can_update_tutorial(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $tutorial = Tutorial::create($this->validTutorialPayload());

        $response = $this->actingAs($admin)->put(route('admin.tutorials.update', $tutorial), [
            ...$this->validTutorialPayload(),
            'title' => '更新后的教程标题',
        ]);

        $response->assertRedirect(route('admin.tutorials'));

        $this->assertDatabaseHas('tutorials', [
            'id' => $tutorial->id,
            'title' => '更新后的教程标题',
        ]);
    }

    public function test_admin_can_update_tutorial_meta(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $tutorial = Tutorial::create([
            ...$this->validTutorialPayload(),
            'status' => 'draft',
            'is_featured' => false,
            'sort_order' => 0,
        ]);

        $response = $this->actingAs($admin)->patch(route('admin.tutorials.meta', $tutorial), [
            'status' => 'published',
            'is_featured' => true,
            'sort_order' => 10,
        ]);

        $response->assertRedirect();

        $tutorial->refresh();
        $this->assertSame('published', $tutorial->status);
        $this->assertTrue($tutorial->is_featured);
        $this->assertSame(10, $tutorial->sort_order);
    }

    public function test_admin_can_delete_tutorial(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $tutorial = Tutorial::create($this->validTutorialPayload());

        $response = $this->actingAs($admin)->delete(route('admin.tutorials.destroy', $tutorial));

        $response->assertRedirect();

        $this->assertDatabaseMissing('tutorials', [
            'id' => $tutorial->id,
        ]);
    }

    public function test_player_cannot_create_tutorial(): void
    {
        $player = User::factory()->create();

        $response = $this->actingAs($player)->post(route('admin.tutorials.store'), $this->validTutorialPayload());

        $response->assertRedirect(route('home'));
    }

    /**
     * @return array<string, mixed>
     */
    private function validTutorialPayload(): array
    {
        return [
            'category' => 'beginner',
            'title' => '测试教程标题',
            'summary' => '这是一段用于测试的教程简介。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['第一步', '第二步'],
            'tips' => ['技巧一'],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => '跟随 (Follow)',
                'ndFilter' => '无',
            ],
            'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
        ];
    }
}
