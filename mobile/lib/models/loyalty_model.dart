class LoyaltyProfileModel {
  final int id;
  final int userId;
  final int points;
  final int totalEarned;
  final int totalRedeemed;
  final String tier; // bronze, silver, gold, platinum
  final DateTime? createdAt;

  LoyaltyProfileModel({
    required this.id,
    required this.userId,
    this.points = 0,
    this.totalEarned = 0,
    this.totalRedeemed = 0,
    this.tier = 'bronze',
    this.createdAt,
  });

  factory LoyaltyProfileModel.fromJson(Map<String, dynamic> json) {
    return LoyaltyProfileModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      points: json['points'] ?? 0,
      totalEarned: json['total_earned'] ?? 0,
      totalRedeemed: json['total_redeemed'] ?? 0,
      tier: json['tier'] ?? 'bronze',
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}

class LoyaltyRewardModel {
  final int id;
  final String name;
  final String? description;
  final int pointsCost;
  final String type;
  final String? icon;
  final int stock;
  final int maxPerUser;
  final bool isActive;
  final DateTime? createdAt;

  LoyaltyRewardModel({
    required this.id,
    required this.name,
    this.description,
    required this.pointsCost,
    required this.type,
    this.icon,
    this.stock = 0,
    this.maxPerUser = 1,
    this.isActive = true,
    this.createdAt,
  });

  factory LoyaltyRewardModel.fromJson(Map<String, dynamic> json) {
    return LoyaltyRewardModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
      pointsCost: json['points_cost'] ?? 0,
      type: json['type'] ?? '',
      icon: json['icon'],
      stock: json['stock'] ?? 0,
      maxPerUser: json['max_per_user'] ?? 1,
      isActive: json['is_active'] ?? true,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}

class LoyaltyTransactionModel {
  final int id;
  final int userId;
  final String type; // earn, redeem, expire, adjust
  final int points;
  final String description;
  final String? reference;
  final int? referenceId;
  final DateTime? createdAt;

  LoyaltyTransactionModel({
    required this.id,
    required this.userId,
    required this.type,
    required this.points,
    required this.description,
    this.reference,
    this.referenceId,
    this.createdAt,
  });

  factory LoyaltyTransactionModel.fromJson(Map<String, dynamic> json) {
    return LoyaltyTransactionModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      type: json['type'] ?? '',
      points: json['points'] ?? 0,
      description: json['description'] ?? '',
      reference: json['reference'],
      referenceId: json['reference_id'],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
