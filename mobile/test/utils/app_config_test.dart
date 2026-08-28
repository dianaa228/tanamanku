import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/core/config/app_config.dart';

void main() {
  group('AppConfig', () {
    test('has correct app name', () {
      expect(AppConfig.appName, 'Tanamanku');
    });

    test('has correct app version', () {
      expect(AppConfig.appVersion, '1.0.0');
    });

    test('has correct storage keys', () {
      expect(AppConfig.tokenKey, 'tanamanku_token');
      expect(AppConfig.userKey, 'tanamanku_user');
    });

    test('has correct default page size', () {
      expect(AppConfig.defaultPageSize, 15);
    });

    test('has api base url', () {
      expect(AppConfig.apiBaseUrl, isNotEmpty);
    });
  });
}
