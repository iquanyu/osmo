<?php

namespace App\Policies;

use App\Models\Tutorial;
use App\Models\User;

class TutorialPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasAdminRole() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Tutorial $tutorial): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasAdminRole();
    }

    public function update(User $user, Tutorial $tutorial): bool
    {
        return $user->hasAdminRole();
    }

    public function delete(User $user, Tutorial $tutorial): bool
    {
        return $user->hasAdminRole();
    }
}
