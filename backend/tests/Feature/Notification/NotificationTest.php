<?php

namespace Tests\Feature\Notification;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Tests\TestCase;

/**
 * Notification feature tests (docs/14-notification.json).
 * Mencakup: list notifikasi, mark as read, mark all as read, ownership check.
 */
class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createNotification(User $user, ?string $readAt = null): DatabaseNotification
    {
        return $user->notifications()->create([
            'id' => \Illuminate\Support\Str::uuid(),
            'type' => 'App\\Notifications\\PlantCareNotification',
            'data' => json_encode(['title' => 'Siram Monstera', 'body' => 'Jadwal penyiraman hari ini']),
            'read_at' => $readAt,
        ]);
    }

    public function test_list_notifikasi(): void
    {
        $this->createNotification($this->user);
        $this->createNotification($this->user);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.unread_count', 2);
    }

    public function test_notifikasi_orang_lain_tidak_terlihat(): void
    {
        $other = User::factory()->create();
        $this->createNotification($other);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('data.unread_count', 0);
    }

    public function test_tandai_satu_notifikasi_dibaca(): void
    {
        $notification = $this->createNotification($this->user);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(200);
        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_tandai_notifikasi_orang_lain_dibaca_ditolak(): void
    {
        $other = User::factory()->create();
        $notification = $this->createNotification($other);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(403);
    }

    public function test_tandai_semua_notifikasi_dibaca(): void
    {
        $this->createNotification($this->user);
        $this->createNotification($this->user);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/notifications/read-all');

        $response->assertStatus(200);

        $this->assertEquals(0, $this->user->unreadNotifications()->count());
    }

    public function test_unread_count_setelah_read_all(): void
    {
        $this->createNotification($this->user);
        $this->createNotification($this->user);

        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/notifications/read-all')
            ->assertStatus(200);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('data.unread_count', 0);
    }
}
