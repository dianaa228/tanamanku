import 'package:flutter/material.dart';
import '../../models/user_model.dart';
import '../../services/auth_service.dart';

/// Provider autentikasi — mengelola sesi & state login/logout.
class AuthProvider extends ChangeNotifier {
  final _service = AuthService();

  UserModel? _user;
  bool _loading = false;
  String? _error;

  UserModel? get user => _user;
  bool get loading => _loading;
  bool get isAuthenticated => _user != null;
  String? get error => _error;

  /// Pulihkan sesi dari local storage saat startup.
  Future<void> restoreSession() async {
    _loading = true;
    notifyListeners();

    try {
      // Coba restore dari local storage dulu
      _user = await _service.restoreSession();

      // Lalu validasi dengan server
      if (_user != null) {
        final serverUser = await _service.me();
        if (serverUser != null) {
          _user = serverUser;
        } else {
          // Token expired
          _user = null;
        }
      }
    } catch (_) {
      _user = null;
    }

    _loading = false;
    notifyListeners();
  }

  /// Muat ulang profil (mis. setelah alamat berubah).
  Future<void> refresh() async {
    if (_user == null) return;
    final serverUser = await _service.me();
    if (serverUser != null) {
      _user = serverUser;
      notifyListeners();
    }
  }

  /// Login.
  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _service.login(email, password);
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

  /// Register.
  Future<bool> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _service.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
      );
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

  /// Logout.
  Future<void> logout() async {
    await _service.logout();
    _user = null;
    notifyListeners();
  }

  String _extractError(dynamic e) {
    try {
      if (e is Exception) {
        // Dio error
        final dynamic dioError = e;
        if (dioError.response?.data?['message'] != null) {
          return dioError.response!.data['message'] as String;
        }
      }
    } catch (_) {}
    return 'Terjadi kesalahan. Coba lagi.';
  }
}
