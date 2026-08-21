<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends BaseController
{
    public function __construct(private SubscriptionService $subscriptionService)
    {
    }

    public function plans(): JsonResponse
    {
        $plans = $this->subscriptionService->getPlans();
        return $this->success($plans, 'Paket dimuat');
    }

    public function current(Request $request): JsonResponse
    {
        $subscription = $this->subscriptionService->getCurrentSubscription($request->user());
        return $this->success($subscription, 'Langganan dimuat');
    }

    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plan_id' => ['required', 'string'],
            'payment_method' => ['required', 'string'],
        ]);

        $subscription = $this->subscriptionService->subscribe(
            $request->user(),
            $data['plan_id'],
            $data['payment_method']
        );

        return $this->created($subscription, 'Berlangganan berhasil');
    }

    public function cancel(Request $request): JsonResponse
    {
        $subscription = $this->subscriptionService->cancelSubscription($request->user());
        return $this->success($subscription, 'Langganan dibatalkan');
    }

    public function billing(Request $request): JsonResponse
    {
        $billing = $this->subscriptionService->getBillingHistory($request->user());
        return $this->success($billing, 'Riwayat billing dimuat');
    }
}
