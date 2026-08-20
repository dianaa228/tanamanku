import '../core/network/api_client.dart';
import '../models/cart_model.dart';

/// Service keranjang belanja — mengonsumsi /api/v1/cart.
class CartService {
  final _api = ApiClient();

  /// Ambil keranjang: GET /cart
  Future<CartModel> fetchCart() async {
    try {
      final res = await _api.get('/cart');
      return CartModel.fromJson(res.data['data'] ?? {'id': 0, 'items': []});
    } catch (_) {
      return CartModel(id: 0, items: []);
    }
  }

  /// Tambah item: POST /cart/items
  Future<void> addItem({required int productId, int quantity = 1, int? variantId}) async {
    await _api.post('/cart/items', data: {
      'product_id': productId,
      'quantity': quantity,
      if (variantId != null) 'variant_id': variantId,
    });
  }

  /// Update jumlah: PUT /cart/items/{id}
  Future<void> updateItem(int cartItemId, int quantity) async {
    await _api.put('/cart/items/$cartItemId', data: {
      'quantity': quantity,
    });
  }

  /// Hapus item: DELETE /cart/items/{id}
  Future<void> removeItem(int cartItemId) async {
    await _api.delete('/cart/items/$cartItemId');
  }

  /// Kosongkan keranjang: DELETE /cart
  Future<void> clear() async {
    await _api.delete('/cart');
  }
}
