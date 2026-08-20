<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $paginator = $request->user()->notifications()->paginate(20);

        return $this->success([
            'items' => $paginator->items(),
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ], 'Notifikasi');
    }

    public function markAsRead(Request $request, DatabaseNotification $notification): JsonResponse
    {
        $this->authorizeNotification($request->user(), $notification);
        $notification->markAsRead();

        return $this->success(null, 'Notifikasi ditandai dibaca');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return $this->success(null, 'Semua notifikasi ditandai dibaca');
    }

    private function authorizeNotification(User $user, DatabaseNotification $notification): void
    {
        if ($notification->notifiable_type !== User::class || $notification->notifiable_id !== $user->id) {
            abort(403, 'Notifikasi ini bukan milik Anda.');
        }
    }
}
