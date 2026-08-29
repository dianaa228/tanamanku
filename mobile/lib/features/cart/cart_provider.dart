import 'package:flutter/material.dart';
import '../../models/cart_model.dart';
import '../../services/cart_service.dart';

/// Provider keranjang belanja — mengelola state cart, item, dan operasi CRUD.
class CartProvider extends ChangeNotifier {
  final _service = CartService();

  CartModel? _cart;
  bool _loading = false;
  String? _error;
  String? _successMessage;

  CartModel? get cart => _cart;
  bool get loading => _loading;
  String? get error => _error;
  String? get successMessage => _successMessage;
  int get itemCount => _cart?.itemCount ?? 0;
  double get subtotal => _cart?.subtotal ?? 0;
  bool get isEmpty => _cart == null || _cart!.items.isEmpty;

  /// Muat keranjang dari server.
  Future<void> fetchCart() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _cart = await _service.fetchCart();
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Tambah item ke keranjang.
  Future<bool> addItem({
    required int productId,
    int quantity = 1,
    int? variantId,
  }) async {
    try {
      await _service.addItem(
        productId: productId,
        quantity: quantity,
        variantId: variantId,
      );
      await fetchCart();
      _successMessage = 'Ditambahkan ke keranjang 🛒';
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Update jumlah item.
  Future<bool> updateItem(int cartItemId, int quantity) async {
    if (quantity < 1) return removeItem(cartItemId);
    try {
      await _service.updateItem(cartItemId, quantity);
      await fetchCart();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Hapus item dari keranjang.
  Future<bool> removeItem(int cartItemId) async {
    try {
      await _service.removeItem(cartItemId);
      await fetchCart();
      _successMessage = 'Item dihapus dari keranjang';
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Kosongkan seluruh keranjang.
  Future<bool> clearCart() async {
    try {
      await _service.clear();
      await fetchCart();
      _successMessage = 'Keranjang dikosongkan';
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Clear pesan success/error.
  void clearMessages() {
    _successMessage = null;
    _error = null;
  }

  String _extractError(dynamic e) {
    try {
      if (e is Exception) {
        final dynamic dioError = e;
        if (dioError.response?.data?['message'] != null) {
          return dioError.response!.data['message'] as String;
        }
      }
    } catch (_) {}
    return 'Terjadi kesalahan. Coba lagi.';
  }
}
