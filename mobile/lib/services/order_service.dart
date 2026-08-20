import '../core/network/api_client.dart';
import '../models/order_model.dart';

/// Service pesanan — mengonsumsi /api/v1/orders.
class OrderService {
  final _api = ApiClient();

  /// Ambil daftar pesanan: GET /orders
  Future<List<OrderModel>> getOrders() async {
    final res = await _api.get('/orders', queryParameters: {'per_page': 30});
    final data = res.data['data'];
    final list = data is Map && data['data'] is List ? data['data'] : (data is List ? data : []);
    return list.map((e) => OrderModel.fromJson(e)).toList();
  }

  /// Detail pesanan: GET /orders/{id}
  Future<OrderModel> getOrder(dynamic id) async {
    final res = await _api.get('/orders/$id');
    return OrderModel.fromJson(res.data['data']);
  }

  /// Checkout: POST /orders
  Future<OrderModel> createOrder({
    required String paymentMethod,
    required Map<String, dynamic> address,
    String? courier,
    String? note,
  }) async {
    final res = await _api.post('/orders', data: {
      'payment_method': paymentMethod,
      'courier': courier ?? 'reguler',
      'address': address,
      if (note != null) 'note': note,
    });
    return OrderModel.fromJson(res.data['data']);
  }

  /// Batalkan pesanan: POST /orders/{id}/cancel
  Future<OrderModel> cancelOrder(dynamic id) async {
    final res = await _api.post('/orders/$id/cancel');
    return OrderModel.fromJson(res.data['data']);
  }
}
