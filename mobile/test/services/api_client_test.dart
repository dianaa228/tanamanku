import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/core/network/api_client.dart';

void main() {
  group('ApiClient', () {
    test('is singleton', () {
      final client1 = ApiClient();
      final client2 = ApiClient();
      expect(identical(client1, client2), true);
    });

    test('has dio instance', () {
      final client = ApiClient();
      expect(client.dio, isNotNull);
    });

    test('has correct base url', () {
      final client = ApiClient();
      expect(client.dio.options.baseUrl, isNotEmpty);
    });

    test('has correct headers', () {
      final client = ApiClient();
      expect(client.dio.options.headers['Accept'], 'application/json');
      expect(client.dio.options.headers['Content-Type'], 'application/json');
    });

    test('has timeout configured', () {
      final client = ApiClient();
      expect(client.dio.options.connectTimeout, const Duration(seconds: 15));
      expect(client.dio.options.receiveTimeout, const Duration(seconds: 15));
    });

    test('has interceptors', () {
      final client = ApiClient();
      expect(client.dio.interceptors.length, greaterThan(0));
    });
  });
}
