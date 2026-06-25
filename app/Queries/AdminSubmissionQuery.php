<?php

namespace App\Queries;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AdminSubmissionQuery
{
    public function __invoke(Request $request): Builder
    {
        $search = trim((string) $request->string('search'));
        $status = (string) $request->string('status', 'pending');

        return Submission::query()
            ->with(['user', 'reviewer', 'publishedTutorial:id,title'])
            ->when(
                in_array($status, SubmissionStatus::adminFilterValues(), true),
                fn (Builder $query) => $query->where('status', $status),
            )
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $nested) use ($search) {
                    $nested->where('title', 'like', "%{$search}%")
                        ->orWhere('summary', 'like', "%{$search}%")
                        ->orWhereHas('user', function (Builder $userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->orderedForAdminReview();
    }

    /**
     * @return array{pendingCount: int, approvedCount: int, rejectedCount: int}
     */
    public function queueCounts(): array
    {
        return [
            'pendingCount' => Submission::ofStatus(SubmissionStatus::Pending)->count(),
            'approvedCount' => Submission::ofStatus(SubmissionStatus::Approved)->count(),
            'rejectedCount' => Submission::ofStatus(SubmissionStatus::Rejected)->count(),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function filters(Request $request): array
    {
        return [
            'search' => trim((string) $request->string('search')),
            'status' => (string) $request->string('status', 'pending'),
        ];
    }
}
