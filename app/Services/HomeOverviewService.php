<?php

namespace App\Services;

use App\Models\CommunityPost;
use App\Models\Tutorial;
use Illuminate\Database\Eloquent\Collection;

class HomeOverviewService
{
    /**
     * @return Collection<int, Tutorial>
     */
    public function getFeaturedTutorials(int $limit = 4): Collection
    {
        return Tutorial::query()
            ->where('status', 'published')
            ->where('is_featured', true)
            ->orderByDesc('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * @return Collection<int, Tutorial>
     */
    public function getLatestTutorials(int $limit = 6): Collection
    {
        return Tutorial::query()
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * @return Collection<int, CommunityPost>
     */
    public function getRecentCommunityPosts(int $limit = 4): Collection
    {
        return CommunityPost::query()
            ->withCount('answers')
            ->orderByDesc('pinned')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}
