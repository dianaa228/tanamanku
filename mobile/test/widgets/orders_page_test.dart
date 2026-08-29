import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tanamanku/features/orders/orders_page.dart';
import 'package:tanamanku/features/orders/order_provider.dart';

void main() {
  group('OrdersPage', () {
    testWidgets('can be instantiated', (tester) async {
      expect(OrdersPage, isA<Type>());
      expect(OrderProvider, isA<Type>());
    });
  });
}
