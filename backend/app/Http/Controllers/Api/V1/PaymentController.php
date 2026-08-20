<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends BaseController
{
    public function __construct(private PaymentService $paymentService)
    {
    }

    public function create(Request $request, Order $order): JsonResponse
    {
        $request->validate(['method' => ['required', 'in:transfer,ewallet,qris,cod']]);

        $payment = $this->paymentService->create($order, $request->input('method'));

        return $this->success($payment, 'Instruksi pembayaran dibuat');
    }

    /**
     * Webhook dari payment gateway — publik, signature diverifikasi di service.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payment = $this->paymentService->handleWebhook($request->all());

        return $this->success(['status' => $payment->status], 'Webhook diterima');
    }
}
