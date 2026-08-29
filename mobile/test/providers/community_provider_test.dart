import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/community/community_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('CommunityProvider', () {
    late CommunityProvider provider;

    setUp(() {
      provider = CommunityProvider();
    });

    test('initial state has empty posts', () {
      expect(provider.posts, isEmpty);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial sending is false', () {
      expect(provider.sending, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });
  });
}
