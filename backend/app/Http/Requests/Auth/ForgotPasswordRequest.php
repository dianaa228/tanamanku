<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // NOTE: 'exists:users,email' sengaja DIHAPUS untuk mencegah
            // email enumeration attack. AuthService::forgotPassword()
            // sudah menangani case email tidak terdaftar secara aman
            // (return success tanpa mengirim email).
            'email' => ['required', 'email'],
        ];
    }
}
