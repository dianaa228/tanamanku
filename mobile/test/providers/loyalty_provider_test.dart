import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/loyalty/loyalty_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('LoyaltyProvider', () {
    late LoyaltyProvider provider;

    setUp(() {
      provider = LoyaltyProvider();
    });

    test('initial state has no profile', () {
      expect(provider.profile, isNull);
      expect(provider.tiers, isEmpty);
      expect(provider.rewards, isEmpty);
      expect(provider.history, isEmpty);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });

    test('points is 0 when no profile', () {
      expect(provider.points, 0);
    });

    test('tier is bronze when no profile', () {
      expect(provider.tier, 'bronze');
    });
  });
}
