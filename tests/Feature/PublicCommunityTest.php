<?php

namespace Tests\Feature;

use App\Models\Answer;
use App\Models\CommunityPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicCommunityTest extends TestCase
{
    use RefreshDatabase;

    public function test_community_index_lists_posts(): void
    {
        CommunityPost::create([
            'author' => '社区飞友',
            'avatar_color' => 'bg-blue-500',
            'title' => '公开社区帖',
            'content' => '请教 ND 镜怎么选？',
            'tags' => ['器材讨论'],
            'likes' => 3,
            'views' => 12,
            'pinned' => false,
        ]);

        $response = $this->get(route('community'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('community/index')
            ->has('posts', 1)
            ->where('posts.0.title', '公开社区帖')
            ->where('posts.0.answers_count', 0)
            ->where('filters.q', '')
            ->has('hotCommunityPosts')
        );
    }

    public function test_community_index_search_filters_posts(): void
    {
        CommunityPost::create([
            'author' => '飞友A',
            'avatar_color' => 'bg-blue-500',
            'title' => 'ND 镜选购',
            'content' => '请教 ND 镜怎么选？',
            'tags' => ['器材讨论'],
            'likes' => 1,
            'views' => 1,
            'pinned' => false,
        ]);

        CommunityPost::create([
            'author' => '飞友B',
            'avatar_color' => 'bg-red-500',
            'title' => '云台模式',
            'content' => '跟随模式怎么用？',
            'tags' => ['云台'],
            'likes' => 0,
            'views' => 0,
            'pinned' => false,
        ]);

        $response = $this->get(route('community', ['q' => 'ND']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('community/index')
            ->has('posts', 1)
            ->where('posts.0.title', 'ND 镜选购')
            ->where('filters.q', 'ND')
            ->where('hotCommunityPosts', [])
        );
    }

    public function test_community_index_shows_hot_posts_when_no_search_keyword_is_present(): void
    {
        CommunityPost::create([
            'author' => '飞友C',
            'avatar_color' => 'bg-emerald-500',
            'title' => '热门社区帖',
            'content' => '用于热门帖子展示测试。',
            'tags' => ['经验分享'],
            'likes' => 8,
            'views' => 40,
            'pinned' => true,
        ]);

        $response = $this->get(route('community'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('community/index')
            ->has('hotCommunityPosts', 1)
            ->where('hotCommunityPosts.0.title', '热门社区帖')
        );
    }

    public function test_community_show_renders_post_and_increments_views(): void
    {
        $post = CommunityPost::create([
            'author' => '提问者',
            'avatar_color' => 'bg-red-500',
            'title' => '详情帖标题',
            'content' => '详情帖正文内容。',
            'tags' => ['夜景'],
            'likes' => 2,
            'views' => 5,
            'pinned' => false,
        ]);

        $post->answers()->create([
            'author' => '解答者',
            'content' => '这是解答内容。',
            'is_official' => false,
        ]);

        $response = $this->get(route('community.show', $post));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('community/show')
            ->where('post.title', '详情帖标题')
            ->has('post.answers', 1)
            ->where('post.views', 6)
        );
    }

    public function test_new_community_post_starts_with_zero_views(): void
    {
        $response = $this->post(route('community.store'), [
            'title' => '新帖子',
            'content' => '这是新帖内容。',
            'tags' => '新手提问',
        ]);

        $response->assertRedirect();

        $post = CommunityPost::query()->where('title', '新帖子')->first();

        $this->assertNotNull($post);
        $this->assertSame(0, $post->views);
        $this->assertSame('热心飞友', $post->author);
    }

    public function test_authenticated_user_name_is_used_as_default_author(): void
    {
        $user = User::factory()->create(['name' => '登录飞友']);

        $this->actingAs($user)->post(route('community.store'), [
            'title' => '带昵称的帖子',
            'content' => '内容',
        ])->assertRedirect();

        $this->assertSame('登录飞友', CommunityPost::query()->latest()->value('author'));
    }

    public function test_authenticated_user_name_is_used_as_default_answer_author(): void
    {
        $user = User::factory()->create(['name' => '解答飞友']);
        $post = CommunityPost::create([
            'author' => '提问者',
            'avatar_color' => 'bg-red-500',
            'title' => '请教参数',
            'content' => '内容',
            'tags' => ['参数'],
            'likes' => 0,
            'views' => 0,
            'pinned' => false,
        ]);

        $this->actingAs($user)->post(route('community.answer', $post), [
            'content' => '这是我的解答。',
        ])->assertRedirect();

        $this->assertSame('解答飞友', $post->answers()->latest()->value('author'));
    }

    public function test_answer_requires_content(): void
    {
        $post = CommunityPost::create([
            'author' => '提问者',
            'avatar_color' => 'bg-red-500',
            'title' => '空白解答校验',
            'content' => '内容',
            'tags' => ['参数'],
            'likes' => 0,
            'views' => 0,
            'pinned' => false,
        ]);

        $response = $this->from(route('community.show', $post))
            ->post(route('community.answer', $post), [
                'author' => '飞友A',
                'content' => '',
            ]);

        $response->assertRedirect(route('community.show', $post));
        $response->assertSessionHasErrors(['content']);
        $this->assertSame(0, $post->answers()->count());
    }

    public function test_player_cannot_publish_official_answer(): void
    {
        $player = User::factory()->create();
        $post = CommunityPost::create([
            'author' => '提问者',
            'avatar_color' => 'bg-red-500',
            'title' => '需要官方回复',
            'content' => '内容',
            'tags' => ['售后'],
            'likes' => 0,
            'views' => 0,
            'pinned' => false,
        ]);

        $response = $this->actingAs($player)->post(route('admin.community.official-answer', $post), [
            'content' => '尝试冒充官方',
        ]);

        $response->assertRedirect(route('home'));
        $this->assertSame(0, Answer::count());
    }

    public function test_admin_can_publish_official_answer(): void
    {
        $admin = User::factory()->asAdmin()->create(['name' => '官方运营']);
        $post = CommunityPost::create([
            'author' => '提问者',
            'avatar_color' => 'bg-red-500',
            'title' => '需要官方回复',
            'content' => '内容',
            'tags' => ['售后'],
            'likes' => 0,
            'views' => 0,
            'pinned' => false,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.community.official-answer', $post), [
            'content' => '这是官方回复。',
        ]);

        $response->assertRedirect();

        $answer = Answer::query()->first();

        $this->assertNotNull($answer);
        $this->assertTrue($answer->is_official);
        $this->assertSame('官方运营', $answer->author);
        $this->assertSame('这是官方回复。', $answer->content);
    }
}
