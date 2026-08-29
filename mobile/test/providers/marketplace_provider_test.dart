import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/marketplace/marketplace_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('MarketplaceProvider', () {
    late MarketplaceProvider provider;

    setUp(() {
      provider = MarketplaceProvider();
    });

    test('initial state has empty lists', () {
      expect(provider.products, isEmpty);
      expect(provider.categories, isEmpty);
      expect(provider.featured, isEmpty);
      expect(provider.currentProduct, isNull);
      expect(provider.plantSpecies, isEmpty);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });

    test('initial filter state defaults', () {
      expect(provider.searchQuery, '');
      expect(provider.selectedCategory, '');
      expect(provider.selectedSort, 'relevansi');
    });

    test('setSearch updates searchQuery', () {
      provider.setSearch('monstera');
      expect(provider.searchQuery, 'monstera');
    });

    test('setCategory updates selectedCategory', () {
      provider.setCategory('tanaman-hias');
      expect(provider.selectedCategory, 'tanaman-hias');
    });

    test('setSort updates selectedSort', () {
      provider.setSort('harga-asc');
      expect(provider.selectedSort, 'harga-asc');
    });

    test('resetFilters resets all filter state', () {
      provider.setSearch('test');
      provider.setCategory('test-cat');
      provider.setSort('harga-desc');

      provider.resetFilters();

      expect(provider.searchQuery, '');
      expect(provider.selectedCategory, '');
      expect(provider.selectedSort, 'relevansi');
    });
  });
}
