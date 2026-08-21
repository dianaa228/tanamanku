import '../core/network/api_client.dart';

/// Model untuk Subscription Plan
class SubscriptionPlanModel {
  final int id;
  final String name;
  final double price;
  final int durationMonths;
  final List<String> features;
  final String? badge;

  SubscriptionPlanModel({
    required this.id,
    required this.name,
    required this.price,
    required this.durationMonths,
    required this.features,
    this.badge,
  });

  factory SubscriptionPlanModel.fromJson(Map<String, dynamic> json) {
    return SubscriptionPlanModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      price: double.tryParse(json['price'].toString()) ?? 0,
      durationMonths: json['duration_months'] ?? 1,
      features: (json['features'] as List?)?.map((e) => e.toString()).toList() ?? [],
      badge: json['badge'],
    );
  }
}

/// Model untuk User Subscription
class UserSubscriptionModel {
  final int id;
  final int planId;
  final String status;
  final String? expiresAt;
  final SubscriptionPlanModel? plan;

  UserSubscriptionModel({
    required this.id,
    required this.planId,
    required this.status,
    this.expiresAt,
    this.plan,
  });

  factory UserSubscriptionModel.fromJson(Map<String, dynamic> json) {
    return UserSubscriptionModel(
      id: json['id'] ?? 0,
      planId: json['plan_id'] ?? 0,
      status: json['status'] ?? 'active',
      expiresAt: json['expires_at'],
      plan: json['plan'] != null ? SubscriptionPlanModel.fromJson(json['plan']) : null,
    );
  }
}

/// Model untuk Billing History
class BillingModel {
  final int id;
  final double amount;
  final String status;
  final String? description;
  final String? createdAt;

  BillingModel({
    required this.id,
    required this.amount,
    required this.status,
    this.description,
    this.createdAt,
  });

  factory BillingModel.fromJson(Map<String, dynamic> json) {
    return BillingModel(
      id: json['id'] ?? 0,
      amount: double.tryParse(json['amount'].toString()) ?? 0,
      status: json['status'] ?? '',
      description: json['description'],
      createdAt: json['created_at'],
    );
  }
}

/// Service Subscription API
class SubscriptionApiService {
  final _api = ApiClient();

  /// GET /subscription/plans
  Future<List<SubscriptionPlanModel>> getPlans() async {
    final res = await _api.get('/subscription/plans');
    final data = res.data['data'];
    return (data as List).map((e) => SubscriptionPlanModel.fromJson(e)).toList();
  }

  /// GET /subscription/current
  Future<UserSubscriptionModel?> getCurrent() async {
    final res = await _api.get('/subscription/current');
    final data = res.data['data'];
    if (data == null) return null;
    return UserSubscriptionModel.fromJson(data);
  }

  /// POST /subscription/subscribe
  Future<void> subscribe({required int planId, required String paymentMethod}) async {
    await _api.post('/subscription/subscribe', data: {
      'plan_id': planId,
      'payment_method': paymentMethod,
    });
  }

  /// POST /subscription/cancel
  Future<void> cancel() async {
    await _api.post('/subscription/cancel');
  }

  /// GET /subscription/billing
  Future<List<BillingModel>> getBilling() async {
    final res = await _api.get('/subscription/billing');
    final data = res.data['data'];
    return (data as List).map((e) => BillingModel.fromJson(e)).toList();
  }
}
