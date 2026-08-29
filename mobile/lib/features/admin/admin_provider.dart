import 'package:flutter/material.dart';
import '../../services/admin_service.dart';

class AdminProvider extends ChangeNotifier {
  final _service = AdminService();

  Map<String, dynamic>? dashboard;
  List<dynamic> users = [];
  List<dynamic> stores = [];
  List<dynamic> categories = [];
  List<dynamic> orders = [];
  List<dynamic> reports = [];
  Map<String, dynamic>? analytics;
  bool loading = false;
  String? error;

  Future<void> loadDashboard() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      dashboard = await _service.getDashboard();
    } catch (e) {
      error = 'Gagal memuat dashboard admin';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadUsers() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      users = await _service.getUsers();
    } catch (e) {
      error = 'Gagal memuat pengguna';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadStores() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      stores = await _service.getStores();
    } catch (e) {
      error = 'Gagal memuat toko';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadCategories() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      categories = await _service.getCategories();
    } catch (e) {
      error = 'Gagal memuat kategori';
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

  Future<void> loadReports() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      reports = await _service.getReports();
    } catch (e) {
      error = 'Gagal memuat laporan';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadAnalytics() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      analytics = await _service.getAnalytics();
    } catch (e) {
      error = 'Gagal memuat analytics';
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
