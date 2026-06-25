<?php

namespace App\Models;

use App\Enums\SubmissionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'status',
        'title',
        'summary',
        'cover_image',
        'details',
        'review_note',
        'reviewed_by',
        'reviewed_at',
        'submitted_at',
        'published_tutorial_id',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'status' => SubmissionStatus::class,
            'reviewed_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function publishedTutorial(): BelongsTo
    {
        return $this->belongsTo(Tutorial::class, 'published_tutorial_id');
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfStatus(Builder $query, SubmissionStatus|string $status): Builder
    {
        $statusValue = $status instanceof SubmissionStatus ? $status->value : $status;

        return $query->where('status', $statusValue);
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeOrderedForContributorWorkspace(Builder $query): Builder
    {
        return $query
            ->orderByRaw(SubmissionStatus::contributorSortOrderSql())
            ->orderByDesc('updated_at');
    }

    public function scopeOrderedForAdminReview(Builder $query): Builder
    {
        return $query
            ->orderByRaw(SubmissionStatus::adminSortOrderSql())
            ->orderByDesc('submitted_at')
            ->orderByDesc('reviewed_at')
            ->orderByDesc('updated_at');
    }

    public function isEditable(): bool
    {
        return $this->status->isEditable();
    }

    public function isPendingReview(): bool
    {
        return $this->status->isPendingReview();
    }
}
