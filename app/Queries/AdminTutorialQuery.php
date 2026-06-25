<?php

namespace App\Queries;

use App\Models\Tutorial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AdminTutorialQuery
{
    public function __invoke(Request $request): Builder
    {
        $search = trim((string) $request->string('search'));
        $category = (string) $request->string('category', 'all');
        $difficulty = (string) $request->string('difficulty', 'all');
        $status = (string) $request->string('status', 'all');
        $featured = (string) $request->string('featured', 'all');

        return Tutorial::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $nested) use ($search) {
                    $nested->where('title', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%");
                });
            })
            ->when($category !== 'all', fn (Builder $query) => $query->where('category', $category))
            ->when($difficulty !== 'all', fn (Builder $query) => $query->where('difficulty', $difficulty))
            ->when($status !== 'all', fn (Builder $query) => $query->where('status', $status))
            ->when($featured === 'yes', fn (Builder $query) => $query->where('is_featured', true))
            ->when($featured === 'no', fn (Builder $query) => $query->where('is_featured', false))
            ->orderByDesc('is_featured')
            ->orderByDesc('sort_order')
            ->orderByDesc('published_at')
            ->latest();
    }

    /**
     * @return array<string, string>
     */
    public function filters(Request $request): array
    {
        return [
            'search' => trim((string) $request->string('search')),
            'category' => (string) $request->string('category', 'all'),
            'difficulty' => (string) $request->string('difficulty', 'all'),
            'status' => (string) $request->string('status', 'all'),
            'featured' => (string) $request->string('featured', 'all'),
        ];
    }
}
