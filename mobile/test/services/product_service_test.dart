import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/product_service.dart';

void main() {
  group('ProductService', () {
    late ProductService service;

    setUp(() {
      service = ProductService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<ProductService>());
    });

    test('getCategories method exists', () {
      expect(service.getCategories, isA<Function>());
    });

    test('getProducts method exists', () {
      expect(service.getProducts, isA<Function>());
    });

    test('getProduct method exists', () {
      expect(service.getProduct, isA<Function>());
    });

    test('getProductsByStore method exists', () {
      expect(service.getProductsByStore, isA<Function>());
    });

    test('toggleFavorite method exists', () {
      expect(service.toggleFavorite, isA<Function>());
    });

    test('getPlantSpecies method exists', () {
      expect(service.getPlantSpecies, isA<Function>());
    });

    test('getSpecies method exists', () {
      expect(service.getSpecies, isA<Function>());
    });
  });
}
