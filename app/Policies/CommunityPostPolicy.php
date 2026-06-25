<?php

namespace App\Policies;

use App\Models\CommunityPost;
use App\Models\User;

class CommunityPostPolicy
{
    public function before(User $user): ?bool
    {
        return $user->hasAdminRole() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, CommunityPost $post): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function delete(User $user, CommunityPost $post): bool
    {
        return $user->hasAdminRole();
    }

    public function pin(User $user, CommunityPost $post): bool
    {
        return $user->hasAdminRole();
    }

    public function officialAnswer(User $user, CommunityPost $post): bool
    {
        return $user->hasAdminRole();
    }
}
