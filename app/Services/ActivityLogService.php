<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogService
{
    /**
     * @param array<string, mixed> $context
     */
    public function record(
        string $action,
        string $message,
        ?User $user = null,
        ?Model $subject = null,
        array $context = [],
        ?Request $request = null,
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'message' => $message,
            'context' => $context,
            'ip_address' => $request?->ip(),
        ]);
    }
}
