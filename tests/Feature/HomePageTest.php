<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\Tutorial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_landing_page_with_curated_content(): void
    {
        Tutorial::create([
            'category' => 'cinematic',
            'title' => '精选教程',
            'summary' => '首页精选内容。',
            'difficulty' => '进阶',
            'duration' => '10 分钟',
            'steps' => ['步骤一'],
            'tips' => ['提示一'],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'D-Log M',
                'gimbalMode' => 'Follow',
                'ndFilter' => 'ND16',
            ],
            'image' => 'https://example.com/featured.jpg',
            'status' => 'published',
            'sort_order' => 99,
            'is_featured' => true,
            'published_at' => now(),
        ]);

        Tutorial::create([
            'category' => 'beginner',
            'title' => '最新教程',
            'summary' => '首页最新内容。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 24fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => 'Tilt Locked',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/latest.jpg',
            'status' => 'published',
            'sort_order' => 1,
            'is_featured' => false,
            'published_at' => now()->subMinute(),
        ]);

        CommunityPost::create([
            'author' => '热心飞友',
            'avatar_color' => 'bg-blue-500',
            'title' => '最近讨论',
            'content' => '首页社区预览内容。',
            'tags' => ['参数讨论'],
            'likes' => 3,
            'views' => 12,
            'pinned' => true,
        ]);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('home')
            ->has('featuredTutorials', 1)
            ->where('featuredTutorials.0.title', '精选教程')
            ->has('latestTutorials')
            ->where('latestTutorials.0.title', '精选教程')
            ->has('recentCommunityPosts', 1)
            ->where('recentCommunityPosts.0.title', '最近讨论')
        );
    }
}
