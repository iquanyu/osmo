<?php

namespace App\Queries;

use App\Models\CommunityPost;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AdminCommunityQuery
{
    public function __invoke(Request $request): Builder
    {
        $search = trim((string) $request->string('search'));
        $tag = (string) $request->string('tag', 'all');
        $sort = (string) $request->string('sort', 'date');

        $query = CommunityPost::query()
            ->withCount('answers')
            ->withExists(['answers as has_official_answer' => fn (Builder $builder) => $builder->where('is_official', true)])
            ->when($search !== '', function (Builder $builder) use ($search) {
                $builder->where(function (Builder $nested) use ($search) {
                    $nested->where('author', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->when($tag !== 'all', fn (Builder $builder) => $builder->whereJsonContains('tags', $tag));

        match ($sort) {
            'views' => $query->orderByDesc('views')->orderByDesc('created_at'),
            'likes' => $query->orderByDesc('likes')->orderByDesc('created_at'),
            'replies' => $query->orderByDesc('answers_count')->orderByDesc('created_at'),
            default => $query->orderByDesc('pinned')->orderByDesc('created_at'),
        };

        return $query;
    }

    /**
     * @return array<string, string>
     */
    public function filters(Request $request): array
    {
        return [
            'search' => trim((string) $request->string('search')),
            'tag' => (string) $request->string('tag', 'all'),
            'sort' => (string) $request->string('sort', 'date'),
        ];
    }
}
