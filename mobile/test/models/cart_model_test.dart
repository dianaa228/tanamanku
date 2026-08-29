import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/cart_model.dart';

void main() {
  group('CartModel', () {
    test('fromJson parses cart correctly', () {
      final json = {
        'id': 1,
        'items': [
          {
            'id': 1,
            'product_id': 10,
            'product': {'name': 'Monstera', 'stock': 25},
            'variant': {'name': '20cm'},
            'quantity': 2,
            'unit_price': 145000,
          },
          {
            'id': 2,
            'product_id': 20,
            'product': {'name': 'Sansevieria', 'stock': 10},
            'quantity': 1,
            'unit_price': 85000,
          }
        ],
      };

      final cart = CartModel.fromJson(json);

      expect(cart.id, 1);
      expect(cart.items.length, 2);
      expect(cart.items[0].productName, 'Monstera');
      expect(cart.items[0].variantName, '20cm');
      expect(cart.items[0].quantity, 2);
      expect(cart.items[1].productName, 'Sansevieria');
    });

    test('fromJson handles empty items', () {
      final cart = CartModel.fromJson({'id': 1, 'items': []});
      expect(cart.items, isEmpty);
    });

    test('fromJson handles null items', () {
      final cart = CartModel.fromJson({'id': 1});
      expect(cart.items, isEmpty);
    });

    test('itemCount sums all quantities', () {
      final cart = CartModel(
        id: 1,
        items: [
          CartItemModel(id: 1, productId: 10, quantity: 2, unitPrice: 145000),
          CartItemModel(id: 2, productId: 20, quantity: 1, unitPrice: 85000),
          CartItemModel(id: 3, productId: 30, quantity: 3, unitPrice: 50000),
        ],
      );

      expect(cart.itemCount, 6); // 2 + 1 + 3
    });

    test('subtotal calculates total price', () {
      final cart = CartModel(
        id: 1,
        items: [
          CartItemModel(id: 1, productId: 10, quantity: 2, unitPrice: 145000),
          CartItemModel(id: 2, productId: 20, quantity: 1, unitPrice: 85000),
        ],
      );

      expect(cart.subtotal, 375000); // (2 * 145000) + (1 * 85000)
    });

    test('subtotal returns 0 for empty cart', () {
      final cart = CartModel(id: 1, items: []);
      expect(cart.subtotal, 0);
      expect(cart.itemCount, 0);
    });
  });

  group('CartItemModel', () {
    test('fromJson parses item correctly', () {
      final json = {
        'id': 1,
        'product_id': 10,
        'product': {'name': 'Monstera', 'stock': 25},
        'variant': {'name': '20cm'},
        'quantity': 2,
        'unit_price': 145000,
      };

      final item = CartItemModel.fromJson(json);

      expect(item.id, 1);
      expect(item.productId, 10);
      expect(item.productName, 'Monstera');
      expect(item.variantName, '20cm');
      expect(item.quantity, 2);
      expect(item.unitPrice, 145000);
      expect(item.productStock, 25);
    });

    test('fromJson handles missing fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'product_id': 10,
      };

      final item = CartItemModel.fromJson(json);

      expect(item.productName, '');
      expect(item.variantName, isNull);
      expect(item.quantity, 1);
      expect(item.unitPrice, 0);
      expect(item.productStock, isNull);
    });

    test('total calculates correctly', () {
      final item = CartItemModel(
        id: 1,
        productId: 10,
        quantity: 3,
        unitPrice: 100000,
      );

      expect(item.total, 300000);
    });
  });
}
