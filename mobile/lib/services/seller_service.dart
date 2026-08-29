import '../core/network/api_client.dart';
import '../core/config/app_config.dart';

class SellerService {
  final _api = ApiClient();

  Future<Map<String, dynamic>> getDashboard() async {
    final res = await _api.get('/seller/dashboard');
    return res.data;
  }

  Future<List<dynamic>> getProducts() async {
    final res = await _api.get('/seller/products');
    return res.data['data'] ?? [];
  }

  Future<Map<String, dynamic>> createProduct(Map<String, dynamic> data) async {
    final res = await _api.post('/seller/products', data: data);
    return res.data;
  }

  Future<Map<String, dynamic>> updateProduct(int id, Map<String, dynamic> data) async {
    final res = await _api.put('/seller/products/$id', data: data);
    return res.data;
  }

  Future<void> deleteProduct(int id) async {
    await _api.delete('/seller/products/$id');
  }

  Future<List<dynamic>> getOrders() async {
    final res = await _api.get('/seller/orders');
    return res.data['data'] ?? [];
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    await _api.put('/seller/orders/$orderId/status', data: {'status': status});
  }

  Future<List<dynamic>> getInventory() async {
    final res = await _api.get('/seller/inventory');
    return res.data['data'] ?? [];
  }

  Future<void> updateInventory(int productId, int quantity) async {
    await _api.put('/seller/inventory/$productId', data: {'quantity': quantity});
  }

  Future<Map<String, dynamic>> getSales() async {
    final res = await _api.get('/seller/sales');
    return res.data;
  }
}
