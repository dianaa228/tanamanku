import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/core/network/local_storage.dart';
import 'package:tanamanku/core/config/app_config.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('LocalStorage', () {
    test('saveToken and getToken', () async {
      await LocalStorage.saveToken('test-token-123');
      final token = await LocalStorage.getToken();
      expect(token, 'test-token-123');
    });

    test('getToken returns null when no token saved', () async {
      final token = await LocalStorage.getToken();
      expect(token, isNull);
    });

    test('removeToken clears token', () async {
      await LocalStorage.saveToken('test-token');
      await LocalStorage.removeToken();
      final token = await LocalStorage.getToken();
      expect(token, isNull);
    });

    test('saveUser and getUser', () async {
      final user = {
        'id': 1,
        'name': 'Budi',
        'email': 'budi@example.com',
      };
      await LocalStorage.saveUser(user);
      final saved = await LocalStorage.getUser();
      expect(saved, isNotNull);
      expect(saved!['id'], 1);
      expect(saved['name'], 'Budi');
    });

    test('getUser returns null when no user saved', () async {
      final user = await LocalStorage.getUser();
      expect(user, isNull);
    });

    test('removeUser clears user', () async {
      await LocalStorage.saveUser({'id': 1, 'name': 'Budi'});
      await LocalStorage.removeUser();
      final user = await LocalStorage.getUser();
      expect(user, isNull);
    });

    test('clearAll removes both token and user', () async {
      await LocalStorage.saveToken('token');
      await LocalStorage.saveUser({'id': 1, 'name': 'Budi'});
      await LocalStorage.clearAll();
      final token = await LocalStorage.getToken();
      final user = await LocalStorage.getUser();
      expect(token, isNull);
      expect(user, isNull);
    });

    test('getUser returns null for invalid JSON', () async {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConfig.userKey, 'invalid-json{{{');
      final user = await LocalStorage.getUser();
      expect(user, isNull);
    });
  });
}
