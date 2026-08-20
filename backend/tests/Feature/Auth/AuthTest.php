<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_menciptakan_user_dan_mengembalikan_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Rina Kartika',
            'email' => 'rina@example.com',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['token']]);

        $this->assertDatabaseHas('users', [
            'email' => 'rina@example.com',
            'role' => UserRole::Customer->value,
        ]);
    }

    public function test_register_validasi_email_duplikat(): void
    {
        User::factory()->create(['email' => 'duplikat@example.com']);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'email' => 'duplikat@example.com',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ])->assertStatus(422);
    }

    public function test_login_berhasil_dan_password_tidak_terekspos(): void
    {
        $user = User::factory()->create(['email' => 'login@example.com', 'password' => 'rahasia123']);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@example.com',
            'password' => 'rahasia123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonMissing(['data' => ['password']]);
    }

    public function test_login_password_salah_ditolak(): void
    {
        User::factory()->create(['email' => 'login@example.com', 'password' => 'rahasia123']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'login@example.com',
            'password' => 'salah',
        ])->assertStatus(422);
    }

    public function test_endpoint_protected_menolak_tanpa_token(): void
    {
        $this->getJson('/api/v1/cart')->assertStatus(401);
    }
}
