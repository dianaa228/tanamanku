<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Seller = 'seller';
    case Admin = 'admin';

    /**
     * Cek apakah role memiliki permission tertentu (docs/03-user-roles.json).
     * Permission diambil dari config/roles.php.
     */
    public function can(string $permission): bool
    {
        $map = config("roles.roles.{$this->value}", []);

        return in_array('*', $map, true) || in_array($permission, $map, true);
    }
}
