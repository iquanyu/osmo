<?php

namespace App\Services;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use App\Models\Tutorial;
use App\Models\User;

class SubmissionService
{
    /**
     * 提交投稿审核：draft/rejected → pending
     */
    public function submit(Submission $submission): void
    {
        if (! $submission->isEditable()) {
            throw new \InvalidArgumentException('只有草稿或已驳回的投稿才能提交审核。');
        }

        $submission->update([
            'status' => SubmissionStatus::Pending,
            'submitted_at' => now(),
            'review_note' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
        ]);
    }

    /**
     * 通过审核：pending → approved，写入 tutorials 正式表并回填 ID
     */
    public function approve(Submission $submission, User $admin): void
    {
        if (! $submission->isPendingReview()) {
            throw new \InvalidArgumentException('只有待审核的投稿才能通过。');
        }

        $details = $submission->details ?? [];

        $tutorial = Tutorial::create([
            'category' => $details['category'] ?? 'beginner',
            'title' => $submission->title,
            'summary' => $submission->summary,
            'difficulty' => $details['difficulty'] ?? '新手',
            'duration' => $details['duration'] ?? '5 分钟',
            'steps' => $details['steps'] ?? [],
            'tips' => $details['tips'] ?? [],
            'settings' => $details['settings'] ?? [
                'resolution' => '4K 30fps',
                'colorProfile' => 'Normal 8-bit',
                'gimbalMode' => '跟随 (Follow)',
                'ndFilter' => '无',
            ],
            'image' => $submission->cover_image ?? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            'status' => 'published',
            'sort_order' => 0,
            'is_featured' => false,
            'published_at' => now(),
        ]);

        $submission->update([
            'status' => SubmissionStatus::Approved,
            'review_note' => null,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'published_tutorial_id' => $tutorial->id,
        ]);
    }

    /**
     * 驳回审核：pending → rejected，附驳回理由
     */
    public function reject(Submission $submission, User $admin, string $note): void
    {
        if (! $submission->isPendingReview()) {
            throw new \InvalidArgumentException('只有待审核的投稿才能驳回。');
        }

        $submission->update([
            'status' => SubmissionStatus::Rejected,
            'review_note' => $note,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);
    }
}
