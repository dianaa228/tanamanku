import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/cart_service.dart';

void main() {
  group('CartService', () {
    late CartService service;

    setUp(() {
      service = CartService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<CartService>());
    });

    test('fetchCart method exists', () {
      expect(service.fetchCart, isA<Function>());
    });

    test('addItem method exists', () {
      expect(service.addItem, isA<Function>());
    });

    test('updateItem method exists', () {
      expect(service.updateItem, isA<Function>());
    });

    test('removeItem method exists', () {
      expect(service.removeItem, isA<Function>());
    });

    test('clear method exists', () {
      expect(service.clear, isA<Function>());
    });
  });
}
