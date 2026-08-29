import 'package:flutter/material.dart';
import '../../services/nursery_service.dart';

/// Provider nursery — mengelola daftar nursery, detail, dan produk nursery.
class NurseryProvider extends ChangeNotifier {
  final _service = NurseryService();

  List<NurseryModel> _nurseries = [];
  NurseryModel? _currentNursery;
  List<NurseryProductModel> _nurseryProducts = [];

  bool _loading = false;
  String? _error;

  List<NurseryModel> get nurseries => _nurseries;
  NurseryModel? get currentNursery => _currentNursery;
  List<NurseryProductModel> get nurseryProducts => _nurseryProducts;
  bool get loading => _loading;
  String? get error => _error;

  /// Muat daftar nursery.
  Future<void> loadNurseries({String? search}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _nurseries = await _service.getNurseries(search: search);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat detail nursery.
  Future<void> loadNursery(String idOrSlug) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _currentNursery = await _service.getNursery(idOrSlug);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat produk dari nursery tertentu.
  Future<void> loadNurseryProducts(int nurseryId) async {
    try {
      _nurseryProducts = await _service.getProducts(nurseryId);
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
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
    return 'Terjadi kesalahan. Coba lagi.';
  }
}
