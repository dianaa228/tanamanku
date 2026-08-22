<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()->load('addresses', 'store')));
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:191'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        $user->update($data);

        return $this->success(new UserResource($user), 'Profil diperbarui');
    }

    // ===== Address =====
    public function addresses(Request $request): JsonResponse
    {
        return $this->success($request->user()->addresses, 'Daftar alamat');
    }

    public function storeAddress(Request $request): JsonResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:50'],
            'recipient' => ['required', 'string', 'max:191'],
            'phone' => ['required', 'string', 'max:20'],
            'province' => ['required', 'string', 'max:191'],
            'city' => ['required', 'string', 'max:191'],
            'district' => ['required', 'string', 'max:191'],
            'street' => ['required', 'string', 'max:500'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $address = $request->user()->addresses()->create($data);

        if ($data['is_default'] ?? false) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        return $this->created($address, 'Alamat ditambahkan');
    }

    public function updateAddress(Request $request, Address $address): JsonResponse
    {
        if ($address->user_id !== $request->user()->id) {
            return $this->forbidden('Alamat ini bukan milik Anda.');
        }

        $address->update($request->validate([
            'label' => ['sometimes', 'string', 'max:50'],
            'recipient' => ['sometimes', 'string', 'max:191'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'city' => ['sometimes', 'string', 'max:191'],
            'district' => ['sometimes', 'string', 'max:191'],
            'street' => ['sometimes', 'string', 'max:500'],
            'postal_code' => ['nullable', 'string', 'max:10'],
        ]));

        return $this->success($address, 'Alamat diperbarui');
    }

    // ===== Admin =====
    public function adminDashboard(): JsonResponse
    {
        return $this->success([
            'users' => User::count(),
            'sellers' => User::where('role', UserRole::Seller->value)->count(),
            'orders' => Order::count(),
            'revenue' => (float) Order::whereNotIn('status', ['pending', 'cancelled'])->sum('total'),
        ], 'Dashboard admin');
    }

    public function adminUsers(Request $request): JsonResponse
    {
        $users = User::query()
            ->withCount('orders')
            ->when($request->input('role'), fn ($q, $r) => $q->where('role', $r))
            ->when($request->input('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15);

        return $this->success(UserResource::collection($users));
    }

    public function adminUpdateRole(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', 'in:customer,seller,admin'],
        ]);

        // Gunakan fill() karena 'role' tidak di $fillable (security fix)
        $user->fill(['role' => $data['role']]);
        $user->save();

        return $this->success(new UserResource($user), 'Role diperbarui');
    }

    public function adminToggleActive(User $user): JsonResponse
    {
        // Gunakan fill() karena 'is_active' tidak di $fillable (security fix)
        $user->fill(['is_active' => ! $user->is_active]);
        $user->save();

        return $this->success(new UserResource($user), 'Status akun diperbarui');
    }
}
