<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseController
{
    public function __construct(private AuthService $authService)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->register($request->validated());

        return $this->created(new UserResource($user), 'Pendaftaran berhasil');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->authService->login($request->validated());

        return $this->success(new UserResource($user), 'Login berhasil');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(null, 'Logout berhasil');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()->load('addresses', 'store')));
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->forgotPassword($request->validated()['email']);

        return $this->success(null, 'Link reset password telah dikirim ke email Anda');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();
        $this->authService->resetPassword(
            token: $data['token'],
            email: $data['email'],
            password: $data['password'],
        );

        return $this->success(null, 'Password berhasil diubah. Silakan login dengan password baru.');
    }
}
