<?php

namespace App\Services;

use App\Models\LoyaltyProfile;
use App\Models\LoyaltyReward;
use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LoyaltyService
{
    private const TIERS = [
        'bronze' => ['min_points' => 0, 'multiplier' => 1],
        'silver' => ['min_points' => 1000, 'multiplier' => 1.5],
        'gold' => ['min_points' => 5000, 'multiplier' => 2],
        'platinum' => ['min_points' => 15000, 'multiplier' => 3],
    ];

    public function getOrCreateProfile(User $user): LoyaltyProfile
    {
        return LoyaltyProfile::firstOrCreate(
            ['user_id' => $user->id],
            ['points' => 0, 'tier' => 'bronze']
        );
    }

    public function earnPoints(User $user, int $points, string $description, ?string $reference = null, ?int $referenceId = null): LoyaltyTransaction
    {
        return DB::transaction(function () use ($user, $points, $description, $reference, $referenceId) {
            $profile = $this->getOrCreateProfile($user);

            $transaction = LoyaltyTransaction::create([
                'user_id' => $user->id,
                'type' => 'earn',
                'points' => $points,
                'description' => $description,
                'reference' => $reference,
                'reference_id' => $referenceId,
            ]);

            $profile->increment('points', $points);
            $profile->increment('total_earned', $points);
            $this->updateTier($profile);

            return $transaction;
        });
    }

    public function redeemReward(User $user, LoyaltyReward $reward): array
    {
        return DB::transaction(function () use ($user, $reward) {
            $profile = $this->getOrCreateProfile($user);

            if ($profile->points < $reward->points_cost) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'points' => ['Poin tidak cukup.'],
                ]);
            }

            $transaction = LoyaltyTransaction::create([
                'user_id' => $user->id,
                'type' => 'redeem',
                'points' => -$reward->points_cost,
                'description' => "Tukar: {$reward->name}",
                'reference' => 'reward',
                'reference_id' => $reward->id,
            ]);

            $profile->decrement('points', $reward->points_cost);
            $profile->increment('total_redeemed', $reward->points_cost);

            if ($reward->stock > 0) {
                $reward->decrement('stock');
            }

            $voucherCode = 'TMR-' . strtoupper(base_convert(time(), 10, 36));

            return [
                'transaction' => $transaction,
                'voucher_code' => $voucherCode,
            ];
        });
    }

    public function getRewards($filters = [])
    {
        $query = LoyaltyReward::where('is_active', true);

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->get();
    }

    public function getHistory(User $user, $filters = [])
    {
        $query = LoyaltyTransaction::where('user_id', $user->id)->latest();

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->get();
    }

    private function updateTier(LoyaltyProfile $profile): void
    {
        $tier = 'bronze';
        foreach (self::TIERS as $name => $config) {
            if ($profile->points >= $config['min_points']) {
                $tier = $name;
            }
        }
        $profile->update(['tier' => $tier]);
    }
}
