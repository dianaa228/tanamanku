<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserPlant;

class UserPlantPolicy
{
    public function view(User $user, UserPlant $userPlant): bool
    {
        return $user->isAdmin() || $userPlant->isOwnedBy($user);
    }

    public function update(User $user, UserPlant $userPlant): bool
    {
        return $userPlant->isOwnedBy($user);
    }

    public function delete(User $user, UserPlant $userPlant): bool
    {
        return $userPlant->isOwnedBy($user);
    }
}
