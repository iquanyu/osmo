<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    /**
     * @return list<string>
     */
    public static function contributorFilterValues(): array
    {
        return [
            self::Draft->value,
            self::Pending->value,
            self::Approved->value,
            self::Rejected->value,
        ];
    }

    /**
     * @return list<string>
     */
    public static function adminFilterValues(): array
    {
        return [
            self::Pending->value,
            self::Approved->value,
            self::Rejected->value,
        ];
    }

    public static function contributorSortOrderSql(): string
    {
        return sprintf(
            "case when status = '%s' then 0 when status = '%s' then 1 when status = '%s' then 2 when status = '%s' then 3 else 4 end",
            self::Draft->value,
            self::Rejected->value,
            self::Pending->value,
            self::Approved->value,
        );
    }

    public static function adminSortOrderSql(): string
    {
        return sprintf(
            "case when status = '%s' then 0 when status = '%s' then 1 when status = '%s' then 2 else 3 end",
            self::Pending->value,
            self::Rejected->value,
            self::Approved->value,
        );
    }

    public function isEditable(): bool
    {
        return in_array($this, [self::Draft, self::Rejected], true);
    }

    public function isPendingReview(): bool
    {
        return $this === self::Pending;
    }
}
