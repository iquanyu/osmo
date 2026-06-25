<?php

namespace Tests\Feature;

use App\Models\CommunityPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCommunityManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_pin_and_unpin_community_post(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $post = CommunityPost::create($this->validPostPayload());

        $this->actingAs($admin)
            ->post(route('admin.community.pin', $post))
            ->assertRedirect();

        $post->refresh();
        $this->assertTrue($post->pinned);

        $this->actingAs($admin)
            ->post(route('admin.community.pin', $post))
            ->assertRedirect();

        $post->refresh();
        $this->assertFalse($post->pinned);
    }

    public function test_admin_can_delete_community_post_from_detail_context(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $post = CommunityPost::create($this->validPostPayload());

        $response = $this->actingAs($admin)->delete(route('admin.community.destroy', $post));

        $response->assertRedirect(route('admin.community'));

        $this->assertDatabaseMissing('community_posts', [
            'id' => $post->id,
        ]);
    }

    public function test_admin_can_post_official_answer(): void
    {
        $admin = User::factory()->asAdmin()->create(['name' => '官方管理员']);
        $post = CommunityPost::create($this->validPostPayload());

        $response = $this->actingAs($admin)->post(route('admin.community.official-answer', $post), [
            'content' => '这是官方回复内容。',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('answers', [
            'community_post_id' => $post->id,
            'author' => '官方管理员',
            'content' => '这是官方回复内容。',
            'is_official' => true,
        ]);
    }

    public function test_admin_community_page_includes_available_tags(): void
    {
        $admin = User::factory()->asAdmin()->create();
        CommunityPost::create([
            ...$this->validPostPayload(),
            'tags' => ['色彩模式', '减光镜'],
        ]);

        $response = $this->actingAs($admin)->get(route('admin.community'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/community')
            ->has('availableTags')
        );
    }

    public function test_admin_community_list_includes_official_answer_flag(): void
    {
        $admin = User::factory()->asAdmin()->create();
        $post = CommunityPost::create($this->validPostPayload());

        $post->answers()->create([
            'author' => '官方管理员',
            'content' => '官方回复内容',
            'is_official' => true,
        ]);

        $response = $this->actingAs($admin)->get(route('admin.community'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/community')
            ->has('posts.data', 1)
            ->where('posts.data.0.has_official_answer', true)
            ->where('posts.data.0.answers_count', 1)
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function validPostPayload(): array
    {
        return [
            'author' => '测试飞友',
            'avatar_color' => 'bg-red-500',
            'title' => '测试社区帖子',
            'content' => '这是测试帖子内容。',
            'tags' => ['新手提问'],
            'likes' => 0,
            'views' => 10,
            'pinned' => false,
        ];
    }
}
