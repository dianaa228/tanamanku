<?php

namespace App\Services;

use App\Jobs\SendOrderNotification;
use App\Models\Order;
use App\Models\Payment;
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
     * Webhook dari payment gateway — diverifikasi signature
     * (docs/12: "Webhook diverifikasi signature").
     */
    public function handleWebhook(array $payload): Payment
    {
        $secret = config('services.payment.webhook_secret');

        // Scaffold: verifikasi sederhana; ganti dengan signature gateway asli.
        if ($secret && ($payload['secret'] ?? null) !== $secret) {
            Log::warning('Payment webhook signature tidak valid.');
            abort(403, 'Signature tidak valid.');
        }

        $payment = Payment::where('reference', $payload['reference'] ?? null)->firstOrFail();

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
