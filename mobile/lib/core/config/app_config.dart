/// Konfigurasi aplikasi Tanamanku.
///
/// Base URL di-set via --dart-define saat build:
///   flutter run --dart-define=API_BASE_URL=https://your-api.com/api/v1
///
/// Jika tidak di-set, menggunakan environment default (development).
class AppConfig {
  // Base URL backend Laravel — JANGAN hardcode production URL di source code
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8000/api/v1', // Android emulator localhost
  );

  static const String appName = 'Tanamanku';
  static const String appVersion = '1.0.0';

  // Storage keys — konsisten dengan web (TOKEN_KEY di auth.js)
  static const String tokenKey = 'tanamanku_token';
  static const String userKey = 'tanamanku_user';

  // Pagination
  static const int defaultPageSize = 15;

  // Rate limiting constants
  static const int maxLoginAttempts = 5;
  static const int lockoutDurationMinutes = 15;
}
