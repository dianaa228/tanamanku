import 'package:flutter/material.dart';
import '../../models/order_model.dart';
import '../../services/order_service.dart';

/// Provider pesanan — mengelola daftar pesanan, detail, buat & batalkan.
class OrderProvider extends ChangeNotifier {
  final _service = OrderService();

  List<OrderModel> _orders = [];
  OrderModel? _currentOrder;
  bool _loading = false;
  String? _error;

  List<OrderModel> get orders => _orders;
  OrderModel? get currentOrder => _currentOrder;
  bool get loading => _loading;
  String? get error => _error;

  /// Filter orders by status
  List<OrderModel> ordersByStatus(String status) {
    if (status == 'semua') return _orders;
    return _orders.where((o) => o.status == status).toList();
  }

  /// Muat daftar pesanan.
  Future<void> loadOrders() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await _service.getOrders();
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat detail pesanan.
  Future<void> loadOrder(dynamic id) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _currentOrder = await _service.getOrder(id);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Buat pesanan baru (checkout).
  Future<OrderModel?> createOrder({
    required String paymentMethod,
    required Map<String, dynamic> address,
    String? courier,
    String? note,
  }) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final order = await _service.createOrder(
        paymentMethod: paymentMethod,
        address: address,
        courier: courier,
        note: note,
      );
      _currentOrder = order;
      _orders.insert(0, order);
      _loading = false;
      notifyListeners();
      return order;
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
      return null;
    }
  }

  /// Batalkan pesanan.
  Future<bool> cancelOrder(dynamic id) async {
    try {
      final updated = await _service.cancelOrder(id);
      final index = _orders.indexWhere((o) => o.id == updated.id);
      if (index != -1) _orders[index] = updated;
      if (_currentOrder?.id == updated.id) _currentOrder = updated;
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
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
    return 'Gagal memuat pesanan. Coba lagi.';
  }
}
