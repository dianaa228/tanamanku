<?php

namespace App\Policies;

use App\Models\PlantReminder;
use App\Models\User;

class PlantReminderPolicy
{
    public function view(User $user, PlantReminder $reminder): bool
    {
        return $reminder->userPlant->isOwnedBy($user);
    }

    public function update(User $user, PlantReminder $reminder): bool
    {
        return $reminder->userPlant->isOwnedBy($user);
    }

    public function delete(User $user, PlantReminder $reminder): bool
    {
        return $reminder->userPlant->isOwnedBy($user);
    }
}
