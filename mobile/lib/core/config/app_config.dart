/// Konfigurasi aplikasi Tanamanku.
class AppConfig {
  // Base URL backend Laravel — sesuaikan dengan environment
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8000/api/v1',
  );

  static const String appName = 'Tanamanku';
  static const String appVersion = '1.0.0';

  // Storage keys
  static const String tokenKey = 'tanamanku_token';
  static const String userKey = 'tanamanku_user';

  // Pagination
  static const int defaultPageSize = 15;
}
