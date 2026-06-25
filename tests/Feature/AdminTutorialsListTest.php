<?php

namespace Tests\Feature;

use App\Models\Tutorial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTutorialsListTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_tutorials_list_page(): void
    {
        $admin = User::factory()->asAdmin()->create();
        Tutorial::create($this->tutorialPayload(['title' => '列表测试教程']));

        $response = $this->actingAs($admin)->get(route('admin.tutorials'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/tutorials')
            ->has('tutorials.data', 1)
            ->where('tutorials.data.0.title', '列表测试教程')
        );
    }

    public function test_admin_can_filter_tutorials_by_status_and_featured(): void
    {
        $admin = User::factory()->asAdmin()->create();
        Tutorial::create($this->tutorialPayload([
            'title' => '已发布精选教程',
            'status' => 'published',
            'is_featured' => true,
        ]));
        Tutorial::create($this->tutorialPayload([
            'title' => '草稿教程',
            'status' => 'draft',
            'is_featured' => false,
        ]));

        $response = $this->actingAs($admin)->get(route('admin.tutorials', [
            'status' => 'published',
            'featured' => 'yes',
        ]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/tutorials')
            ->has('tutorials.data', 1)
            ->where('tutorials.data.0.title', '已发布精选教程')
            ->where('filters.status', 'published')
            ->where('filters.featured', 'yes')
        );
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function tutorialPayload(array $overrides = []): array
    {
        return array_merge([
            'category' => 'beginner',
            'title' => '测试教程',
            'summary' => '测试简介',
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
            'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
        ], $overrides);
    }
}
