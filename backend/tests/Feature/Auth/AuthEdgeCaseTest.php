<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Auth edge case tests — melengkapi AuthTest.php dasar.
 * Mencakup: validasi input ketat, akun nonaktif, lifecycle token, password hashing.
 */
class AuthEdgeCaseTest extends TestCase
{
    use RefreshDatabase;

    // ── Register edge cases ──

    public function test_register_email_format_invalid(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'email' => 'bukan-email',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_register_password_terlalu_pendek(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'password' => '123',
            'password_confirmation' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_register_tanpa_password_confirmation(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'password' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_register_password_tidak_cocok(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia456',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    public function test_register_nama_wajib(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'email' => 'budi@example.com',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_register_email_wajib(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Budi',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_password_tidak_terekspos_di_database(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Rina',
            'email' => 'rina@example.com',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $user = User::where('email', 'rina@example.com')->first();

        $this->assertNotNull($user);
        $this->assertNotEquals('rahasia123', $user->password);
        $this->assertTrue(Hash::check('rahasia123', $user->password));
    }

    public function test_register_default_role_customer(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Customer Baru',
            'email' => 'customer@example.com',
            'password' => 'rahasia123',
            'password_confirmation' => 'rahasia123',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'customer@example.com',
            'role' => UserRole::Customer->value,
        ]);
    }

    // ── Login edge cases ──

    public function test_login_email_tidak_terdaftar(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'tidakada@example.com',
            'password' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_akun_nonaktif(): void
    {
        User::factory()->create([
            'email' => 'nonaktif@example.com',
            'password' => 'rahasia123',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonaktif@example.com',
            'password' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_email_wajib(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'password' => 'rahasia123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_login_password_wajib(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    // ── Token lifecycle ──

    public function test_logout_membuat_token_tidak_valid(): void
    {
        $user = User::factory()->create(['password' => 'rahasia123']);

        // Login → dapat token
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'rahasia123',
        ]);
        $token = $loginResponse->json('data.token');

        // Logout
        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout')
            ->assertStatus(200);

        // Token lama sudah tidak valid
        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }

    public function test_me_mengembalikan_data_user_saat_ini(): void
    {
        $user = User::factory()->create(['name' => 'Rina Kartika']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Rina Kartika')
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonMissing(['data' => ['password']]);
    }

    public function test_me_tanpa_token_ditolak(): void
    {
        $this->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }

    // ── Forgot password ──

    public function test_forgot_password_email_tidak_ada(): void
    {
        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'tidakada@example.com',
        ]);

        $response->assertStatus(404); // firstOrFail
    }

    public function test_forgot_password_email_terdaftar(): void
    {
        User::factory()->create(['email' => 'ada@example.com']);

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'ada@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ── Role-based access ──

    public function test_customer_tidak_bisa_akses_seller_endpoint(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/seller/products')
            ->assertStatus(403);
    }

    public function test_customer_tidak_bisa_akses_admin_endpoint(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertStatus(403);
    }

    public function test_seller_tidak_bisa_akses_admin_endpoint(): void
    {
        $seller = User::factory()->seller()->create();

        $this->actingAs($seller, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertStatus(403);
    }
}
