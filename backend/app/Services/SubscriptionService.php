<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    public function getPlans()
    {
        return SubscriptionPlan::where('is_active', true)->get();
    }

    public function getCurrentSubscription(User $user): ?Subscription
    {
        return Subscription::where('user_id', $user->id)
            ->with('plan')
            ->latest()
            ->first();
    }

    public function subscribe(User $user, string $planSlug, string $paymentMethod): Subscription
    {
        return DB::transaction(function () use ($user, $planSlug, $paymentMethod) {
            $plan = SubscriptionPlan::where('slug', $planSlug)->where('is_active', true)->firstOrFail();

            // Cancel existing subscription if any
            Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'status' => 'active',
                'started_at' => now(),
                'expires_at' => now()->addMonth(),
                'auto_renew' => true,
                'payment_method' => $paymentMethod,
            ]);

            return $subscription->load('plan');
        });
    }

    public function cancelSubscription(User $user): Subscription
    {
        $subscription = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->firstOrFail();

        $subscription->update([
            'auto_renew' => false,
            'status' => 'cancelled',
        ]);

        return $subscription->load('plan');
    }

    public function getBillingHistory(User $user)
    {
        // Placeholder — in real app, this would query a billing/payments table
        return [];
    }
}
