<?php

namespace App\Queries;

use App\Models\Tutorial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PublicTutorialQuery
{
    private const CATEGORY_FILTERS = [
        'all',
        'beginner',
        'cinematic',
        'night',
        'vlog',
        'creative',
    ];

    public function __invoke(Request $request): Builder
    {
        $filters = $this->filters($request);

        return Tutorial::query()
            ->where('status', 'published')
            ->when(
                $filters['category'] !== 'all',
                fn (Builder $query) => $query->where('category', $filters['category']),
            )
            ->when($filters['q'] !== '', function (Builder $query) use ($filters): void {
                $query->where(function (Builder $builder) use ($filters): void {
                    $builder->where('title', 'like', "%{$filters['q']}%")
                        ->orWhere('summary', 'like', "%{$filters['q']}%");
                });
            })
            ->orderByDesc('is_featured')
            ->orderByDesc('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');
    }

    /**
     * @return array{category: string, q: string}
     */
    public function filters(Request $request): array
    {
        $category = $request->string('category', 'all')->toString();

        if (! in_array($category, self::CATEGORY_FILTERS, true)) {
            $category = 'all';
        }

        return [
            'category' => $category,
            'q' => trim($request->string('q', '')->toString()),
        ];
    }
}
