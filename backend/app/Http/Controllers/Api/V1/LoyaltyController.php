<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\LoyaltyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoyaltyController extends BaseController
{
    public function __construct(private LoyaltyService $loyaltyService)
    {
    }

    public function profile(Request $request): JsonResponse
    {
        $profile = $this->loyaltyService->getOrCreateProfile($request->user());
        return $this->success($profile, 'Profil loyalitas dimuat');
    }

    public function tiers(): JsonResponse
    {
        return $this->success([
            ['id' => 'bronze', 'name' => 'Bronze', 'icon' => '🥉', 'min_points' => 0, 'benefits' => ['1x poin per Rp1.000 belanja', 'Akses promo dasar']],
            ['id' => 'silver', 'name' => 'Silver', 'icon' => '🥈', 'min_points' => 1000, 'benefits' => ['1.5x poin per Rp1.000 belanja', 'Gratis ongkir 2x/bulan', 'Prioritas support']],
            ['id' => 'gold', 'name' => 'Gold', 'icon' => '🥇', 'min_points' => 5000, 'benefits' => ['2x poin per Rp1.000 belanja', 'Gratis ongkir unlimited', 'Early access produk baru']],
            ['id' => 'platinum', 'name' => 'Platinum', 'icon' => '💎', 'min_points' => 15000, 'benefits' => ['3x poin per Rp1.000 belanja', 'Semua benefit Gold', 'Personal plant advisor']],
        ], 'Tier dimuat');
    }

    public function rewards(Request $request): JsonResponse
    {
        $rewards = $this->loyaltyService->getRewards($request->only(['type']));
        return $this->success($rewards, 'Rewards dimuat');
    }

    public function redeem(Request $request, int $rewardId): JsonResponse
    {
        $reward = \App\Models\LoyaltyReward::findOrFail($rewardId);
        $result = $this->loyaltyService->redeemReward($request->user(), $reward);
        return $this->created($result, 'Reward berhasil ditukar');
    }

    public function history(Request $request): JsonResponse
    {
        $history = $this->loyaltyService->getHistory($request->user(), $request->only(['type']));
        return $this->success($history, 'Riwayat dimuat');
    }
}
