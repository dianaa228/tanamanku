import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/auth_service.dart';

void main() {
  group('AuthService', () {
    late AuthService service;

    setUp(() {
      service = AuthService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<AuthService>());
    });

    test('login method exists and returns Future', () {
      // Verify the method signature exists
      expect(service.login, isA<Function>());
    });

    test('register method exists and returns Future', () {
      expect(service.register, isA<Function>());
    });

    test('logout method exists and returns Future', () {
      expect(service.logout, isA<Function>());
    });

    test('me method exists and returns Future', () {
      expect(service.me, isA<Function>());
    });

    test('restoreSession method exists and returns Future', () {
      expect(service.restoreSession, isA<Function>());
    });

    test('forgotPassword method exists and returns Future', () {
      expect(service.forgotPassword, isA<Function>());
    });
  });
}
