import '../core/network/api_client.dart';

/// Model untuk Loyalty Profile
class LoyaltyProfileModel {
  final int id;
  final int userId;
  final int points;
  final int totalEarned;
  final int totalRedeemed;
  final String tier;

  LoyaltyProfileModel({
    required this.id,
    required this.userId,
    required this.points,
    required this.totalEarned,
    required this.totalRedeemed,
    required this.tier,
  });

  factory LoyaltyProfileModel.fromJson(Map<String, dynamic> json) {
    return LoyaltyProfileModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      points: json['points'] ?? 0,
      totalEarned: json['total_earned'] ?? 0,
      totalRedeemed: json['total_redeemed'] ?? 0,
      tier: json['tier'] ?? 'bronze',
    );
  }

  String get tierIcon {
    switch (tier) {
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      default: return '🥉';
    }
  }

  String get tierLabel {
    switch (tier) {
      case 'platinum': return 'Platinum';
      case 'gold': return 'Gold';
      case 'silver': return 'Silver';
      default: return 'Bronze';
    }
  }
}

/// Model untuk Loyalty Reward
class LoyaltyRewardModel {
  final int id;
  final String name;
  final String? description;
  final String type;
  final int pointsCost;
  final int? stock;

  LoyaltyRewardModel({
    required this.id,
    required this.name,
    this.description,
    required this.type,
    required this.pointsCost,
    this.stock,
  });

  factory LoyaltyRewardModel.fromJson(Map<String, dynamic> json) {
    return LoyaltyRewardModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
      type: json['type'] ?? '',
      pointsCost: json['points_cost'] ?? 0,
      stock: json['stock'],
    );
  }

  String get typeIcon {
    switch (type) {
      case 'voucher': return '🎫';
      case 'free_shipping': return '🚚';
      case 'bonus_points': return '⭐';
      case 'product': return '🎁';
      case 'service': return '🔧';
      case 'premium': return '👑';
      default: return '🎁';
    }
  }
}

/// Model untuk Loyalty Transaction
class LoyaltyTransactionModel {
  final int id;
  final String type;
  final int points;
  final String? description;
  final String? createdAt;

  LoyaltyTransactionModel({
    required this.id,
    required this.type,
    required this.points,
    this.description,
    this.createdAt,
  });

  factory LoyaltyTransactionModel.fromJson(Map<String, dynamic> json) {
    return LoyaltyTransactionModel(
      id: json['id'] ?? 0,
      type: json['type'] ?? '',
      points: json['points'] ?? 0,
      description: json['description'],
      createdAt: json['created_at'],
    );
  }

  bool get isEarn => type == 'earn';
}

/// Service Loyalty API
class LoyaltyService {
  final _api = ApiClient();

  /// GET /loyalty/profile
  Future<LoyaltyProfileModel> getProfile() async {
    final res = await _api.get('/loyalty/profile');
    return LoyaltyProfileModel.fromJson(res.data['data']);
  }

  /// GET /loyalty/tiers
  Future<List<Map<String, dynamic>>> getTiers() async {
    final res = await _api.get('/loyalty/tiers');
    final data = res.data['data'];
    return (data as List).map((e) => Map<String, dynamic>.from(e)).toList();
  }

  /// GET /loyalty/rewards
  Future<List<LoyaltyRewardModel>> getRewards({String? type}) async {
    final res = await _api.get('/loyalty/rewards', queryParameters: {
      if (type != null) 'type': type,
    });
    final data = res.data['data'];
    return (data as List).map((e) => LoyaltyRewardModel.fromJson(e)).toList();
  }

  /// POST /loyalty/rewards/{id}/redeem
  Future<void> redeemReward(int rewardId) async {
    await _api.post('/loyalty/rewards/$rewardId/redeem');
  }

  /// GET /loyalty/history
  Future<List<LoyaltyTransactionModel>> getHistory({String? type}) async {
    final res = await _api.get('/loyalty/history', queryParameters: {
      if (type != null) 'type': type,
    });
    final data = res.data['data'];
    return (data as List).map((e) => LoyaltyTransactionModel.fromJson(e)).toList();
  }
}
