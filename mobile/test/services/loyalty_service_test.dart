import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/loyalty_service.dart';

void main() {
  group('LoyaltyProfileModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'user_id': 10,
        'points': 500,
        'total_earned': 1000,
        'total_redeemed': 500,
        'tier': 'gold',
      };

      final profile = LoyaltyProfileModel.fromJson(json);

      expect(profile.id, 1);
      expect(profile.userId, 10);
      expect(profile.points, 500);
      expect(profile.totalEarned, 1000);
      expect(profile.totalRedeemed, 500);
      expect(profile.tier, 'gold');
    });

    test('tierIcon returns correct emoji', () {
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'platinum').tierIcon, '💎');
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'gold').tierIcon, '🥇');
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'silver').tierIcon, '🥈');
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'bronze').tierIcon, '🥉');
    });

    test('tierLabel returns correct label', () {
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'platinum').tierLabel, 'Platinum');
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'gold').tierLabel, 'Gold');
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'silver').tierLabel, 'Silver');
      expect(LoyaltyProfileModel(id: 1, userId: 1, points: 0, totalEarned: 0, totalRedeemed: 0, tier: 'bronze').tierLabel, 'Bronze');
    });
  });

  group('LoyaltyRewardModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'name': 'Voucher Rp50.000',
        'description': 'Voucher belanja',
        'type': 'voucher',
        'points_cost': 500,
        'stock': 10,
      };

      final reward = LoyaltyRewardModel.fromJson(json);

      expect(reward.id, 1);
      expect(reward.name, 'Voucher Rp50.000');
      expect(reward.type, 'voucher');
      expect(reward.pointsCost, 500);
      expect(reward.stock, 10);
    });

    test('typeIcon returns correct emoji', () {
      expect(LoyaltyRewardModel(id: 1, name: 'Test', type: 'voucher', pointsCost: 100).typeIcon, '🎫');
      expect(LoyaltyRewardModel(id: 1, name: 'Test', type: 'free_shipping', pointsCost: 100).typeIcon, '🚚');
      expect(LoyaltyRewardModel(id: 1, name: 'Test', type: 'bonus_points', pointsCost: 100).typeIcon, '⭐');
      expect(LoyaltyRewardModel(id: 1, name: 'Test', type: 'product', pointsCost: 100).typeIcon, '🎁');
    });
  });

  group('LoyaltyTransactionModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'type': 'earn',
        'points': 100,
        'description': 'Pembelian',
        'created_at': '2026-01-15T10:00:00Z',
      };

      final tx = LoyaltyTransactionModel.fromJson(json);

      expect(tx.id, 1);
      expect(tx.type, 'earn');
      expect(tx.points, 100);
      expect(tx.description, 'Pembelian');
      expect(tx.isEarn, true);
    });

    test('isEarn returns false for redeem', () {
      final tx = LoyaltyTransactionModel(id: 1, type: 'redeem', points: 100);
      expect(tx.isEarn, false);
    });
  });

  group('LoyaltyService', () {
    late LoyaltyService service;

    setUp(() {
      service = LoyaltyService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<LoyaltyService>());
    });

    test('getProfile method exists', () {
      expect(service.getProfile, isA<Function>());
    });

    test('getTiers method exists', () {
      expect(service.getTiers, isA<Function>());
    });

    test('getRewards method exists', () {
      expect(service.getRewards, isA<Function>());
    });

    test('redeemReward method exists', () {
      expect(service.redeemReward, isA<Function>());
    });

    test('getHistory method exists', () {
      expect(service.getHistory, isA<Function>());
    });
  });
}
