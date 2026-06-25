<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\CommunityPost;
use App\Models\Submission;
use App\Models\Tutorial;
use Illuminate\Database\Eloquent\Collection;

class AdminOverviewService
{
    private const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    /**
     * @return array<string, int>
     */
    public function getStats(): array
    {
        return [
            'tutorialCount' => Tutorial::count(),
            'publishedTutorialCount' => Tutorial::where('status', 'published')->count(),
            'draftTutorialCount' => Tutorial::where('status', 'draft')->count(),
            'featuredTutorialCount' => Tutorial::where('is_featured', true)->count(),
            'postCount' => CommunityPost::count(),
            'totalLikes' => (int) CommunityPost::sum('likes'),
            'totalAnswers' => Answer::count(),
            'pinnedCount' => CommunityPost::where('pinned', true)->count(),
            'pendingSubmissionCount' => Submission::ofStatus('pending')->count(),
        ];
    }

    /**
     * @return Collection<int, Tutorial>
     */
    public function getRecentTutorials(int $limit = 5): Collection
    {
        return Tutorial::query()
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * @return Collection<int, CommunityPost>
     */
    public function getRecentPosts(int $limit = 5): Collection
    {
        return CommunityPost::query()
            ->withCount('answers')
            ->orderByDesc('pinned')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * @return list<array{day: string, date: string, tutorials: int, submissions: int, communityPosts: int, reviews: int}>
     */
    public function getWeeklyTrend(): array
    {
        $trend = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $end = $date->copy()->endOfDay();

            $trend[] = [
                'day' => self::WEEKDAY_LABELS[$date->dayOfWeek],
                'date' => $date->toDateString(),
                'tutorials' => Tutorial::whereBetween('created_at', [$date, $end])->count(),
                'submissions' => Submission::whereBetween('submitted_at', [$date, $end])->count(),
                'communityPosts' => CommunityPost::whereBetween('created_at', [$date, $end])->count(),
                'reviews' => Submission::whereBetween('reviewed_at', [$date, $end])->count(),
            ];
        }

        return $trend;
    }

    /**
     * @return list<string>
     */
    public function getAvailableTags(): array
    {
        return CommunityPost::query()
            ->pluck('tags')
            ->flatten()
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();
    }
}
