<?php

namespace Tests\Unit\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

/**
 * Unit tests untuk PaymentService — webhook HMAC signature verification.
 * Mencakup: valid signature, invalid signature, missing header, no secret config.
 */
class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    private PaymentService $service;
    private User $user;
    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PaymentService();
        $this->user = User::factory()->create();

        // Buat order minimal
        $this->order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'total' => 100000,
        ]);
    }

    // ── Signature Verification ──

    public function test_valid_signature_diterima(): void
    {
        config(['services.payment.webhook_secret' => 'my-secret-key']);
        config(['services.payment.webhook_header' => 'X-Webhook-Signature']);

        $payload = '{"reference":"TRANSFER-20260822","status":"paid"}';
        $signature = hash_hmac('sha256', $payload, 'my-secret-key');

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [], [], [], [
            'HTTP_X_WEBHOOK_SIGNATURE' => $signature,
        ], $payload);

        $result = $this->service->verifyWebhookSignature($request);

        $this->assertTrue($result);
    }

    public function test_invalid_signature_ditolak(): void
    {
        config(['services.payment.webhook_secret' => 'my-secret-key']);
        config(['services.payment.webhook_header' => 'X-Webhook-Signature']);

        $payload = '{"reference":"TRANSFER-20260822","status":"paid"}';
        $wrongSignature = hash_hmac('sha256', $payload, 'wrong-secret');

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [], [], [], [
            'HTTP_X_WEBHOOK_SIGNATURE' => $wrongSignature,
        ], $payload);

        $result = $this->service->verifyWebhookSignature($request);

        $this->assertFalse($result);
    }

    public function test_missing_signature_header_ditolak(): void
    {
        config(['services.payment.webhook_secret' => 'my-secret-key']);
        config(['services.payment.webhook_header' => 'X-Webhook-Signature']);

        $payload = '{"reference":"TRANSFER-20260822","status":"paid"}';

        // Tidak ada header signature
        $request = Request::create('/api/v1/webhooks/payment', 'POST', [], [], [], [], $payload);

        $result = $this->service->verifyWebhookSignature($request);

        $this->assertFalse($result);
    }

    public function test_empty_secret_skip_verifikasi(): void
    {
        config(['services.payment.webhook_secret' => '']);

        $payload = '{"reference":"TRANSFER-20260822","status":"paid"}';
        $request = Request::create('/api/v1/webhooks/payment', 'POST', [], [], [], [], $payload);

        // Tanpa secret, verifikasi selalu lolos (dev/stub mode)
        $result = $this->service->verifyWebhookSignature($request);

        $this->assertTrue($result);
    }

    public function test_custom_header_name(): void
    {
        config(['services.payment.webhook_secret' => 'my-secret-key']);
        config(['services.payment.webhook_header' => 'X-Pay-Signature']);

        $payload = '{"reference":"TRANSFER-20260822","status":"paid"}';
        $signature = hash_hmac('sha256', $payload, 'my-secret-key');

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [], [], [], [
            'HTTP_X_PAY_SIGNATURE' => $signature,
        ], $payload);

        $result = $this->service->verifyWebhookSignature($request);

        $this->assertTrue($result);
    }

    // ── Webhook Handling ──

    public function test_webhook_paid_memproses_pembayaran(): void
    {
        config(['services.payment.webhook_secret' => '']);

        // Buat payment untuk order
        $payment = Payment::create([
            'order_id' => $this->order->id,
            'method' => 'transfer',
            'reference' => 'TRANSFER-20260822-123456',
            'amount' => 100000,
            'status' => 'pending',
        ]);

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [
            'reference' => 'TRANSFER-20260822-123456',
            'status' => 'paid',
        ]);

        $result = $this->service->handleWebhook($request);

        $this->assertEquals(Payment::STATUS_PAID, $result->status);
        $this->assertNotNull($result->paid_at);
    }

    public function test_webhook_failed_membatalkan_order(): void
    {
        config(['services.payment.webhook_secret' => '']);

        $payment = Payment::create([
            'order_id' => $this->order->id,
            'method' => 'transfer',
            'reference' => 'TRANSFER-20260822-123456',
            'amount' => 100000,
            'status' => 'pending',
        ]);

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [
            'reference' => 'TRANSFER-20260822-123456',
            'status' => 'failed',
        ]);

        $result = $this->service->handleWebhook($request);

        $this->assertEquals('failed', $result->status);
    }

    public function test_webhook_reference_tidak_ada_404(): void
    {
        config(['services.payment.webhook_secret' => '']);

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [
            'reference' => 'NONEXISTENT-REF',
            'status' => 'paid',
        ]);

        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->handleWebhook($request);
    }

    public function test_webhook_payload_tanpa_reference_422(): void
    {
        config(['services.payment.webhook_secret' => '']);

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [
            'status' => 'paid',
            // reference missing
        ]);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

        $this->service->handleWebhook($request);
    }

    public function test_webhook_status_tidak_valid_422(): void
    {
        config(['services.payment.webhook_secret' => '']);

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [
            'reference' => 'TRANSFER-20260822-123456',
            'status' => 'invalid_status',
        ]);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

        $this->service->handleWebhook($request);
    }

    public function test_webhook_invalid_signature_403(): void
    {
        config(['services.payment.webhook_secret' => 'my-secret-key']);
        config(['services.payment.webhook_header' => 'X-Webhook-Signature']);

        $payload = '{"reference":"TRANSFER-20260822","status":"paid"}';
        $wrongSignature = hash_hmac('sha256', $payload, 'wrong-secret');

        $request = Request::create('/api/v1/webhooks/payment', 'POST', [], [], [], [
            'HTTP_X_WEBHOOK_SIGNATURE' => $wrongSignature,
        ], $payload);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpHttpException::class);

        $this->service->handleWebhook($request);
    }

    // ── Create Payment ──

    public function test_create_payment_berhasil(): void
    {
        $payment = $this->service->create($this->order, 'transfer');

        $this->assertEquals(Payment::STATUS_PENDING, $payment->status);
        $this->assertEquals(100000, $payment->amount);
        $this->assertDatabaseHas('payments', [
            'order_id' => $this->order->id,
            'method' => 'transfer',
            'status' => 'pending',
        ]);
    }

    public function test_create_payment_sudah_dibayar_gagal(): void
    {
        $this->order->update(['payment_status' => 'paid']);

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $this->service->create($this->order, 'transfer');
    }

    // ── Mark as Paid ──

    public function test_mark_as_paid_update_order_status(): void
    {
        $payment = Payment::create([
            'order_id' => $this->order->id,
            'method' => 'transfer',
            'reference' => 'TRANSFER-20260822-123456',
            'amount' => 100000,
            'status' => 'pending',
        ]);

        $result = $this->service->markAsPaid($payment);

        $this->assertEquals(Payment::STATUS_PAID, $result->status);
        $this->assertNotNull($result->paid_at);

        $this->order->refresh();
        $this->assertEquals(Order::STATUS_PAID, $this->order->status);
        $this->assertEquals(Payment::STATUS_PAID, $this->order->payment_status);
    }

    public function test_mark_as_paid_idempotent(): void
    {
        $payment = Payment::create([
            'order_id' => $this->order->id,
            'method' => 'transfer',
            'reference' => 'TRANSFER-20260822-123456',
            'amount' => 100000,
            'status' => Payment::STATUS_PAID,
            'paid_at' => now()->subHour(),
        ]);

        // Panggil lagi — tidak harus throw error
        $result = $this->service->markAsPaid($payment);

        $this->assertEquals(Payment::STATUS_PAID, $result->status);
    }
}
