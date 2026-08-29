import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/exchange/exchange_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('ExchangeProvider', () {
    late ExchangeProvider provider;

    setUp(() {
      provider = ExchangeProvider();
    });

    test('initial state has empty lists', () {
      expect(provider.listings, isEmpty);
      expect(provider.myListings, isEmpty);
      expect(provider.myExchanges, isEmpty);
      expect(provider.currentListing, isNull);
    });

    test('initial filterType is null', () {
      expect(provider.filterType, isNull);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });

    test('setFilterType updates filterType', () {
      provider.setFilterType('sell');
      expect(provider.filterType, 'sell');
    });

    test('setFilterType with null resets filter', () {
      provider.setFilterType('sell');
      provider.setFilterType(null);
      expect(provider.filterType, isNull);
    });
  });
}
