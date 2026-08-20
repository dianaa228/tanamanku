import '../core/network/api_client.dart';
import '../core/network/local_storage.dart';
import '../models/user_model.dart';

/// Service autentikasi — mengonsumsi /api/v1/auth/*.
class AuthService {
  final _api = ApiClient();

  /// Login: POST /auth/login
  Future<UserModel> login(String email, String password) async {
    final res = await _api.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    final data = res.data['data'];
    final user = UserModel.fromJson(data);

    // Simpan token & user
    if (user.token != null) await LocalStorage.saveToken(user.token!);
    await LocalStorage.saveUser(user.toJson());

    return user;
  }

  /// Register: POST /auth/register
  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    final res = await _api.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
      'password_confirmation': password,
      if (phone != null) 'phone': phone,
    });
    final data = res.data['data'];
    final user = UserModel.fromJson(data);

    if (user.token != null) await LocalStorage.saveToken(user.token!);
    await LocalStorage.saveUser(user.toJson());

    return user;
  }

  /// Logout: POST /auth/logout
  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {
      // Bersihkan lokal meskipun API gagal
    }
    await LocalStorage.clearAll();
  }

  /// Ambil profil dari server: GET /auth/me
  Future<UserModel?> me() async {
    try {
      final token = await LocalStorage.getToken();
      if (token == null) return null;

      final res = await _api.get('/auth/me');
      final user = UserModel.fromJson(res.data['data']);
      await LocalStorage.saveUser(user.toJson());
      return user;
    } catch (_) {
      return null;
    }
  }

  /// Pulihkan sesi dari local storage
  Future<UserModel?> restoreSession() async {
    final json = await LocalStorage.getUser();
    if (json == null) return null;
    return UserModel.fromJson(json);
  }

  /// Forgot password: POST /auth/forgot-password
  Future<void> forgotPassword(String email) async {
    await _api.post('/auth/forgot-password', data: {'email': email});
  }
}
