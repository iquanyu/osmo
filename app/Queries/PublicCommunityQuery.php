<?php

namespace App\Queries;

use App\Models\CommunityPost;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PublicCommunityQuery
{
    public function __invoke(Request $request): Builder
    {
        $filters = $this->filters($request);

        return CommunityPost::query()
            ->withCount('answers')
            ->when($filters['q'] !== '', function (Builder $query) use ($filters): void {
                $query->where(function (Builder $builder) use ($filters): void {
                    $builder->where('title', 'like', "%{$filters['q']}%")
                        ->orWhere('content', 'like', "%{$filters['q']}%");
                });
            })
            ->orderByDesc('pinned')
            ->orderByDesc('created_at');
    }

    /**
     * @return array{q: string}
     */
    public function filters(Request $request): array
    {
        return [
            'q' => trim($request->string('q', '')->toString()),
        ];
    }
}
