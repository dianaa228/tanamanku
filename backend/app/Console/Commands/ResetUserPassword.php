<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ResetUserPassword extends Command
{
    protected $signature = 'tanamanku:reset-password
                            {email : Email pengguna yang akan di-reset passwordnya}
                            {--password= : Password baru (jika tidak diisi, akan diminta secara interaktif)}';

    protected $description = 'Reset password pengguna berdasarkan email';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("❌ Pengguna dengan email '{$email}' tidak ditemukan.");
            return 1;
        }

        // Ambil password baru
        $password = $this->option('password');

        if (empty($password)) {
            $password = $this->secret('Masukkan password baru');
            $confirm = $this->secret('Konfirmasi password baru');

            if ($password !== $confirm) {
                $this->error('❌ Password tidak cocok.');
                return 1;
            }
        }

        if (strlen($password) < 8) {
            $this->error('❌ Password minimal 8 karakter.');
            return 1;
        }

        // Update password
        $user->password = bcrypt($password);
        $user->save();

        $this->info("✅ Password untuk '{$user->name}' ({$user->email}) berhasil diubah.");
        return 0;
    }
}
