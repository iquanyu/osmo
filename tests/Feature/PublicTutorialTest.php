<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\Tutorial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicTutorialTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutorials_index_lists_published_tutorials_without_detail_fields(): void
    {
        Tutorial::create([
            'category' => 'cinematic',
            'title' => '公开教程',
            'summary' => '面向访客的教程内容。',
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
            'image' => 'https://example.com/cover.jpg',
            'status' => 'published',
            'sort_order' => 1,
            'is_featured' => true,
            'published_at' => now(),
        ]);

        Tutorial::create([
            'category' => 'beginner',
            'title' => '草稿教程',
            'summary' => '不应出现在前台。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => 'Follow',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/draft.jpg',
            'status' => 'draft',
            'sort_order' => 0,
            'is_featured' => false,
            'published_at' => null,
        ]);

        $response = $this->get(route('tutorials.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tutorials/index')
            ->has('tutorials.data', 1)
            ->where('tutorials.data.0.title', '公开教程')
            ->where('tutorials.data.0.is_featured', true)
            ->where('tutorials.current_page', 1)
            ->where('filters.category', 'all')
            ->where('filters.q', '')
            ->missing('featuredTutorials')
            ->missing('latestTutorials')
            ->missing('hotCommunityPosts')
            ->missing('tutorials.data.0.steps')
            ->missing('tutorials.data.0.tips')
        );
    }

    public function test_tutorials_index_filters_by_category(): void
    {
        Tutorial::create([
            'category' => 'night',
            'title' => '夜景教程',
            'summary' => '夜景专项。',
            'difficulty' => '进阶',
            'duration' => '8 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'D-Log M',
                'gimbalMode' => 'Follow',
                'ndFilter' => 'ND16',
            ],
            'image' => 'https://example.com/night.jpg',
            'status' => 'published',
            'sort_order' => 1,
            'is_featured' => false,
            'published_at' => now(),
        ]);

        Tutorial::create([
            'category' => 'beginner',
            'title' => '新手教程',
            'summary' => '新手专项。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => 'Follow',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/beginner.jpg',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
            'published_at' => now(),
        ]);

        $response = $this->get(route('tutorials.index', ['category' => 'night']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tutorials/index')
            ->has('tutorials.data', 1)
            ->where('tutorials.data.0.title', '夜景教程')
            ->where('filters.category', 'night')
        );
    }

    public function test_tutorials_index_search_filters_by_title_or_summary(): void
    {
        Tutorial::create([
            'category' => 'cinematic',
            'title' => 'D-Log 电影感教程',
            'summary' => '色彩工作流专项。',
            'difficulty' => '进阶',
            'duration' => '10 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'D-Log M',
                'gimbalMode' => 'Follow',
                'ndFilter' => 'ND16',
            ],
            'image' => 'https://example.com/cover.jpg',
            'status' => 'published',
            'sort_order' => 1,
            'is_featured' => false,
            'published_at' => now(),
        ]);

        Tutorial::create([
            'category' => 'beginner',
            'title' => '新手入门',
            'summary' => '无关内容。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => 'Follow',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/beginner.jpg',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
            'published_at' => now(),
        ]);

        $response = $this->get(route('tutorials.index', ['q' => 'D-Log']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tutorials/index')
            ->has('tutorials.data', 1)
            ->where('tutorials.data.0.title', 'D-Log 电影感教程')
            ->where('filters.q', 'D-Log')
        );
    }

    public function test_tutorials_index_falls_back_to_all_when_category_is_invalid(): void
    {
        Tutorial::create([
            'category' => 'beginner',
            'title' => '默认分类教程',
            'summary' => '用于非法分类兜底测试。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => 'Follow',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/fallback.jpg',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
            'published_at' => now(),
        ]);

        $response = $this->get(route('tutorials.index', ['category' => 'invalid-category']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tutorials/index')
            ->where('filters.category', 'all')
            ->has('tutorials.data', 1)
        );
    }

    public function test_tutorials_index_paginates_published_tutorials(): void
    {
        for ($index = 1; $index <= 10; $index++) {
            Tutorial::create([
                'category' => 'beginner',
                'title' => "分页教程 {$index}",
                'summary' => "第 {$index} 篇教程。",
                'difficulty' => '新手',
                'duration' => '5 分钟',
                'steps' => ['步骤一'],
                'tips' => [],
                'settings' => [
                    'resolution' => '4K 30fps',
                    'colorProfile' => 'Normal 8-bit',
                    'gimbalMode' => 'Follow',
                    'ndFilter' => '无',
                ],
                'image' => 'https://example.com/tutorial-'.$index.'.jpg',
                'status' => 'published',
                'sort_order' => 10 - $index,
                'is_featured' => false,
                'published_at' => now()->subMinutes($index),
            ]);
        }

        $firstPage = $this->get(route('tutorials.index'));

        $firstPage->assertOk();
        $firstPage->assertInertia(fn ($page) => $page
            ->component('tutorials/index')
            ->has('tutorials.data', 9)
            ->where('tutorials.current_page', 1)
            ->where('tutorials.last_page', 2)
            ->where('tutorials.total', 10)
            ->where('tutorials.data.0.title', '分页教程 1')
        );

        $secondPage = $this->get(route('tutorials.index', ['page' => 2]));

        $secondPage->assertOk();
        $secondPage->assertInertia(fn ($page) => $page
            ->component('tutorials/index')
            ->has('tutorials.data', 1)
            ->where('tutorials.current_page', 2)
            ->where('tutorials.data.0.title', '分页教程 10')
        );
    }

    public function test_tutorials_show_renders_published_tutorial(): void
    {
        $tutorial = Tutorial::create([
            'category' => 'cinematic',
            'title' => '详情教程',
            'summary' => '详情页摘要。',
            'difficulty' => '大师',
            'duration' => '12 分钟',
            'steps' => ['步骤一：调整参数'],
            'tips' => ['注意曝光'],
            'settings' => [
                'resolution' => '4K 24fps',
                'colorProfile' => 'D-Log M',
                'gimbalMode' => 'Follow',
                'ndFilter' => 'ND64',
            ],
            'image' => 'https://example.com/detail.jpg',
            'status' => 'published',
            'sort_order' => 1,
            'is_featured' => true,
            'published_at' => now(),
        ]);

        $response = $this->get(route('tutorials.show', $tutorial));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('tutorials/show')
            ->where('tutorial.title', '详情教程')
            ->where('tutorial.steps.0', '步骤一：调整参数')
            ->where('tutorial.tips.0', '注意曝光')
            ->where('tutorial.settings.resolution', '4K 24fps')
            ->where('tutorial.settings.ndFilter', 'ND64')
        );
    }

    public function test_tutorials_show_returns_not_found_for_draft(): void
    {
        $tutorial = Tutorial::create([
            'category' => 'beginner',
            'title' => '草稿详情',
            'summary' => '不应公开。',
            'difficulty' => '新手',
            'duration' => '5 分钟',
            'steps' => ['步骤一'],
            'tips' => [],
            'settings' => [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => 'Follow',
                'ndFilter' => '无',
            ],
            'image' => 'https://example.com/draft-detail.jpg',
            'status' => 'draft',
            'sort_order' => 0,
            'is_featured' => false,
            'published_at' => null,
        ]);

        $this->get(route('tutorials.show', $tutorial))->assertNotFound();
    }
}
