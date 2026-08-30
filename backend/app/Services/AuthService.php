<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
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
     * Includes account lockout after 5 failed attempts.
     */
    public function login(array $data): User
    {
        $user = User::where('email', $data['email'])->first();

        // Check account lockout
        if ($user && $this->isAccountLocked($user)) {
            throw ValidationException::withMessages([
                'email' => ['Akun terkunci sementara karena terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.'],
            ]);
        }

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            // Record failed attempt
            if ($user) {
                $this->recordFailedAttempt($user);
            }
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda dinonaktifkan. Hubungi admin.'],
            ]);
        }

        // Reset failed attempts on successful login
        $this->resetFailedAttempts($user);

        $user->token = $user->createToken('tanamanku')->plainTextToken;

        return $user;
    }

    /**
     * Check if account is locked due to too many failed login attempts.
     */
    private function isAccountLocked(User $user): bool
    {
        $lockoutMinutes = (int) env('LOCKOUT_DURATION_MINUTES', 15);
        $maxAttempts = (int) env('MAX_LOGIN_ATTEMPTS', 5);

        $failedAttempts = \Cache::get("login_attempts_{$user->id}", 0);
        $lockedUntil = \Cache::get("login_locked_{$user->id}");

        if ($lockedUntil && now()->timestamp < $lockedUntil) {
            return true;
        }

        if ($lockedUntil && now()->timestamp >= $lockedUntil) {
            // Lockout expired, reset
            \Cache::forget("login_attempts_{$user->id}");
            \Cache::forget("login_locked_{$user->id}");
            return false;
        }

        return false;
    }

    /**
     * Record a failed login attempt.
     */
    private function recordFailedAttempt(User $user): void
    {
        $lockoutMinutes = (int) env('LOCKOUT_DURATION_MINUTES', 15);
        $maxAttempts = (int) env('MAX_LOGIN_ATTEMPTS', 5);
        $attemptKey = "login_attempts_{$user->id}";
        $lockoutKey = "login_locked_{$user->id}";

        $attempts = \Cache::increment($attemptKey);
        \Cache::put($attemptKey, $attempts, $lockoutMinutes * 60);

        if ($attempts >= $maxAttempts) {
            \Cache::put($lockoutKey, now()->addMinutes($lockoutMinutes)->timestamp, $lockoutMinutes * 60);
        }
    }

    /**
     * Reset failed login attempts after successful login.
     */
    private function resetFailedAttempts(User $user): void
    {
        \Cache::forget("login_attempts_{$user->id}");
        \Cache::forget("login_locked_{$user->id}");
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
        $user = User::where('email', $email)->first();

        if (! $user) {
            // Tetap return success untuk mencegah email enumeration attack
            return;
        }

        // Generate token
        $token = Str::random(64);

        // Simpan token ke database (hapus token lama jika ada)
        \DB::table('password_reset_tokens')->where('email', $email)->delete();
        \DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => \Hash::make($token),
            'created_at' => Carbon::now(),
        ]);

        // Kirim email
        Mail::to($email)->send(new ResetPasswordMail(
            name: $user->name,
            token: $token,
            email: $email,
        ));
    }

    /**
     * Reset password dengan token.
     */
    public function resetPassword(string $token, string $email, string $password): void
    {
        $resetRecord = \DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (! $resetRecord) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ['Token tidak valid atau sudah kedaluwarsa.'],
            ]);
        }

        // Cek token belum expired (60 menit)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(Carbon::now()) > 60) {
            \DB::table('password_reset_tokens')->where('email', $email)->delete();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ['Token sudah kedaluwarsa. Silakan minta link baru.'],
            ]);
        }

        // Verifikasi token
        if (! Hash::check($token, $resetRecord->token)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ['Token tidak valid.'],
            ]);
        }

        // Update password
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->password = $password;
            $user->save();
        }

        // Hapus token setelah berhasil
        \DB::table('password_reset_tokens')->where('email', $email)->delete();
    }
}
