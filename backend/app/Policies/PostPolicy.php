<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function delete(User $user, Post $post): bool
    {
        // Penulis post atau admin (moderasi)
        return $user->isAdmin() || $post->isOwnedBy($user);
    }
}
