import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/auth/auth_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('AuthProvider', () {
    late AuthProvider provider;

    setUp(() {
      provider = AuthProvider();
    });

    test('initial state is not authenticated', () {
      expect(provider.isAuthenticated, false);
      expect(provider.user, isNull);
      expect(provider.loading, false);
      expect(provider.error, isNull);
    });

    test('logout clears user state', () async {
      await provider.logout();
      expect(provider.user, isNull);
      expect(provider.isAuthenticated, false);
    });

    test('error is initially null', () {
      expect(provider.error, isNull);
    });

    test('loading is initially false', () {
      expect(provider.loading, false);
    });
  });
}
