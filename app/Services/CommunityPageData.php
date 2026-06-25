<?php

namespace App\Services;

use App\Models\CommunityPost;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CommunityPageData
{
    /**
     * @return array<string, mixed>
     */
    public static function listItem(CommunityPost $post): array
    {
        return [
            'id' => $post->id,
            'author' => $post->author,
            'avatar_color' => $post->avatar_color,
            'title' => $post->title,
            'content' => Str::limit((string) $post->content, 160),
            'tags' => $post->tags ?? [],
            'likes' => $post->likes,
            'views' => $post->views,
            'pinned' => $post->pinned,
            'answers_count' => (int) ($post->answers_count ?? $post->answers()->count()),
            'created_at' => $post->created_at,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function detail(CommunityPost $post): array
    {
        return [
            'id' => $post->id,
            'author' => $post->author,
            'avatar_color' => $post->avatar_color,
            'title' => $post->title,
            'content' => $post->content,
            'tags' => $post->tags ?? [],
            'likes' => $post->likes,
            'views' => $post->views,
            'pinned' => $post->pinned,
            'answers' => $post->answers
                ->map(fn ($answer): array => [
                    'id' => $answer->id,
                    'author' => $answer->author,
                    'content' => $answer->content,
                    'is_official' => (bool) $answer->is_official,
                    'created_at' => $answer->created_at,
                ])
                ->all(),
            'created_at' => $post->created_at,
            'updated_at' => $post->updated_at,
        ];
    }

    /**
     * @param  Collection<int, CommunityPost>  $posts
     * @return array<int, array<string, mixed>>
     */
    public static function listCollection(Collection $posts): array
    {
        return $posts
            ->map(fn (CommunityPost $post): array => self::listItem($post))
            ->all();
    }
}
