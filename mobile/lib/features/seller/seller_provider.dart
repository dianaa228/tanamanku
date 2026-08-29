import 'package:flutter/material.dart';
import '../../services/seller_service.dart';

class SellerProvider extends ChangeNotifier {
  final _service = SellerService();

  Map<String, dynamic>? dashboard;
  List<dynamic> products = [];
  List<dynamic> orders = [];
  List<dynamic> inventory = [];
  Map<String, dynamic>? sales;
  bool loading = false;
  String? error;

  Future<void> loadDashboard() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      dashboard = await _service.getDashboard();
    } catch (e) {
      error = 'Gagal memuat dashboard';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadProducts() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      products = await _service.getProducts();
    } catch (e) {
      error = 'Gagal memuat produk';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadOrders() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      orders = await _service.getOrders();
    } catch (e) {
      error = 'Gagal memuat pesanan';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadInventory() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      inventory = await _service.getInventory();
    } catch (e) {
      error = 'Gagal memuat inventaris';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadSales() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      sales = await _service.getSales();
    } catch (e) {
      error = 'Gagal memuat laporan penjualan';
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
