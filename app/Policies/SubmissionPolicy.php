<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;

class SubmissionPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasAdminRole() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id && $submission->isEditable();
    }

    public function delete(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id && $submission->isEditable();
    }

    public function submit(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id && $submission->isEditable();
    }

    public function approve(User $user, Submission $submission): bool
    {
        return $user->hasAdminRole();
    }

    public function reject(User $user, Submission $submission): bool
    {
        return $user->hasAdminRole();
    }
}
