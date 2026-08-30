import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

/// HTTP client untuk Tanamanku API — Dio + Bearer token interceptor.
class ApiClient {
  late final Dio _dio;
  static ApiClient? _instance;

  ApiClient._() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString(AppConfig.tokenKey);
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        final statusCode = error.response?.statusCode;
        if (statusCode == 401 || statusCode == 403) {
          // Token expired atau akses ditolak — bersihkan sesi
          try {
            final prefs = await SharedPreferences.getInstance();
            await prefs.remove(AppConfig.tokenKey);
            await prefs.remove(AppConfig.userKey);
          } catch (_) {
            // Abaikan error cleanup — session tetap dibersihkan di UI
          }
        }
        handler.next(error);
      },
    ));
  }

  factory ApiClient() => _instance ??= ApiClient._();

  Dio get dio => _dio;

  /// POST request
  Future<Response> post(String path, {dynamic data, Map<String, dynamic>? queryParameters}) {
    return _dio.post(path, data: data, queryParameters: queryParameters);
  }

  /// GET request
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }

  /// PUT request
  Future<Response> put(String path, {dynamic data}) {
    return _dio.put(path, data: data);
  }

  /// DELETE request
  Future<Response> delete(String path) {
    return _dio.delete(path);
  }

  /// Ekstrak pesan error dari response Laravel.
  /// Format: { "message": "...", "errors": { "field": ["msg"] } }
  static String extractError(dynamic error) {
    if (error is! DioException) return 'Terjadi kesalahan tidak terduga.';

    final data = error.response?.data;
    if (data is Map<String, dynamic>) {
      // Laravel validation errors: { errors: { field: [msgs] } }
      final errors = data['errors'] as Map<String, dynamic>?;
      if (errors != null && errors.isNotEmpty) {
        final firstField = errors.values.first;
        if (firstField is List && firstField.isNotEmpty) {
          return firstField.first.toString();
        }
      }
      // Single message: { message: '...' }
      final msg = data['message'];
      if (msg is String && msg.isNotEmpty) return msg;
    }

    // Fallback berdasarkan status code
    switch (error.response?.statusCode) {
      case 401:
        return 'Sesi telah berakhir. Silakan login kembali.';
      case 403:
        return 'Anda tidak memiliki akses ke fitur ini.';
      case 404:
        return 'Data yang dicari tidak ditemukan.';
      case 422:
        return 'Data yang dikirim tidak valid.';
      case 429:
        return 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.';
      case 500:
        return 'Terjadi kesalahan server. Silakan coba lagi nanti.';
      default:
        return 'Terjadi kesalahan jaringan. Periksa koneksi Anda.';
    }
  }
}
