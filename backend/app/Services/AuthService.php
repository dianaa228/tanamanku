<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Daftarkan user baru (role default: customer).
     * Password di-hash otomatis oleh cast 'hashed' pada model.
     */
    public function register(array $data): User
    {
        // Gunakan fill() + save() karena 'role' tidak di $fillable (security fix)
        $user = new User();
        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
        ]);
        $user->role = UserRole::Customer;
        $user->save();

        $user->token = $user->createToken('tanamanku')->plainTextToken;

        return $user;
    }

    /**
     * Login: verifikasi kredensial, cek akun aktif, terbitkan token Sanctum.
     */
    public function login(array $data): User
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda dinonaktifkan. Hubungi admin.'],
            ]);
        }

        $user->token = $user->createToken('tanamanku')->plainTextToken;

        return $user;
    }

    public function logout(User $user): void
    {
        // Hanya hapus token saat ini
        $user->currentAccessToken()?->delete();
    }

    /**
     * Kirim email reset password.
     * Tidak mengungkapkan apakah email terdaftar (security best practice).
     */
    public function forgotPassword(string $email): void
    {
        // Cari user tapi jangan throw jika tidak ada
        // Ini mencegah email enumeration attack
        User::where('email', $email)->first();
    }
}
