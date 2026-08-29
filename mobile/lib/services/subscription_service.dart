import '../core/network/api_client.dart';

class SubscriptionService {
  final _api = ApiClient();

  Future<List<dynamic>> getPlans() async {
    final res = await _api.get('/subscription/plans');
    return res.data['data'] ?? [];
  }

  Future<Map<String, dynamic>> getCurrentSubscription() async {
    final res = await _api.get('/subscription/current');
    return res.data;
  }

  Future<Map<String, dynamic>> subscribe(String planId, String paymentMethod) async {
    final res = await _api.post('/subscription/subscribe', data: {
      'plan_id': planId,
      'payment_method': paymentMethod,
    });
    return res.data;
  }

  Future<void> cancelSubscription() async {
    await _api.post('/subscription/cancel');
  }

  Future<List<dynamic>> getBillingHistory() async {
    final res = await _api.get('/subscription/billing');
    return res.data['data'] ?? [];
  }
}
