import 'package:flutter/material.dart';
import '../../services/service_service.dart';

/// Provider jasa berkebun — mengelola daftar layanan, booking, dan riwayat.
class GardeningServiceProvider extends ChangeNotifier {
  final _service = GardeningApiService();

  List<GardeningServiceModel> _services = [];
  GardeningServiceModel? _currentService;
  List<ServiceOrderModel> _bookings = [];
  String? _filterCategory;

  bool _loading = false;
  String? _error;

  List<GardeningServiceModel> get services => _services;
  GardeningServiceModel? get currentService => _currentService;
  List<ServiceOrderModel> get bookings => _bookings;
  String? get filterCategory => _filterCategory;
  bool get loading => _loading;
  String? get error => _error;

  /// Muat daftar layanan.
  Future<void> loadServices({String? category}) async {
    _loading = true;
    _error = null;
    if (category != null) _filterCategory = category;
    notifyListeners();

    try {
      _services = await _service.getServices(category: _filterCategory);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat detail layanan.
  Future<void> loadService(int id) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _currentService = await _service.getService(id);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Buat booking layanan.
  Future<bool> createBooking({
    required int serviceId,
    required String scheduleAt,
    required Map<String, dynamic> address,
    String? notes,
  }) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final booking = await _service.createBooking(
        serviceId: serviceId,
        scheduleAt: scheduleAt,
        address: address,
        notes: notes,
      );
      _bookings.insert(0, booking);
      _loading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  /// Muat riwayat booking.
  Future<void> loadMyBookings() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _bookings = await _service.getMyBookings();
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Set filter kategori.
  void setCategory(String? category) {
    _filterCategory = category;
    loadServices(category: category);
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
