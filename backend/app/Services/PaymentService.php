<?php

namespace App\Services;

use App\Jobs\SendOrderNotification;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    /**
     * Buat instruksi pembayaran (VA / QRIS / e-wallet).
     * Scaffold: mengembalikan reference stub; integrasi gateway di fase berikutnya
     * (lihat docs/15-payment.json).
     */
    public function create(Order $order, string $method): Payment
    {
        if ($order->payment_status !== Payment::STATUS_PENDING) {
            throw ValidationException::withMessages(['order' => ['Pesanan sudah dibayar atau tidak dapat dibayar lagi.']]);
        }

        $payment = $order->payment()->updateOrCreate([], [
            'method' => $method,
            'reference' => strtoupper($method).'-'.now()->format('YmdHis'),
            'amount' => $order->total,
            'status' => Payment::STATUS_PENDING,
        ]);

        return $payment;
    }

    /**
     * Verifikasi HMAC-SHA256 signature dari payment gateway.
     *
     * @return bool true jika signature valid
     */
    public function verifyWebhookSignature(Request $request): bool
    {
        $secret = config('services.payment.webhook_secret', '');

        // Jika tidak ada secret dikonfigurasi, skip verifikasi (dev/stub mode)
        if (empty($secret)) {
            Log::info('Payment webhook: no secret configured, skipping signature verification.');
            return true;
        }

        $headerName = config('services.payment.webhook_header', 'X-Webhook-Signature');
        $receivedSignature = $request->header($headerName);

        if (empty($receivedSignature)) {
            Log::warning('Payment webhook: missing signature header.', [
                'header' => $headerName,
            ]);
            return false;
        }

        // Hitung HMAC-SHA256 dari raw request body
        $rawBody = $request->getContent();
        $computedSignature = hash_hmac('sha256', $rawBody, $secret);

        // Timing-safe comparison untuk mencegah timing attacks
        if (! hash_equals($computedSignature, $receivedSignature)) {
            Log::warning('Payment webhook: invalid signature.', [
                'expected' => substr($computedSignature, 0, 8) . '...',
                'received' => substr($receivedSignature, 0, 8) . '...',
            ]);
            return false;
        }

        return true;
    }

    /**
     * Webhook dari payment gateway — diverifikasi HMAC-SHA256 signature
     * (docs/12: "Webhook diverifikasi signature").
     */
    public function handleWebhook(Request $request): Payment
    {
        // 1. Verifikasi HMAC signature terlebih dahulu
        if (! $this->verifyWebhookSignature($request)) {
            abort(403, 'Webhook signature tidak valid.');
        }

        // 2. Decode payload
        $payload = $request->all();

        // 3. Validasi payload minimum
        if (empty($payload['reference']) || empty($payload['status'])) {
            Log::warning('Payment webhook: invalid payload.', [
                'keys' => array_keys($payload),
            ]);
            abort(422, 'Webhook payload tidak valid.');
        }

        $validStatuses = ['pending', 'paid', 'failed', 'expired', 'refunded'];
        if (! in_array($payload['status'], $validStatuses, true)) {
            Log::warning('Payment webhook: unknown status.', [
                'status' => $payload['status'],
            ]);
            abort(422, 'Status pembayaran tidak dikenal.');
        }

        $payment = Payment::where('reference', $payload['reference'])->firstOrFail();

        if ($payload['status'] === 'paid') {
            $this->markAsPaid($payment);
        } elseif ($payload['status'] === 'failed' || $payload['status'] === 'expired') {
            $payment->update(['status' => $payload['status']]);
            if ($payment->order->status === Order::STATUS_PENDING) {
                app(OrderService::class)->cancel($payment->order);
            }
        }

        return $payment;
    }

    public function markAsPaid(Payment $payment): Payment
    {
        if ($payment->status === Payment::STATUS_PAID) {
            return $payment;
        }

        $payment->update(['status' => Payment::STATUS_PAID, 'paid_at' => now()]);

        $order = $payment->order;
        $order->update([
            'status' => Order::STATUS_PAID,
            'payment_status' => Payment::STATUS_PAID,
        ]);

        SendOrderNotification::dispatch($order);

        return $payment;
    }
}
