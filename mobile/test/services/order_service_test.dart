import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/order_service.dart';

void main() {
  group('OrderService', () {
    late OrderService service;

    setUp(() {
      service = OrderService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<OrderService>());
    });

    test('getOrders method exists', () {
      expect(service.getOrders, isA<Function>());
    });

    test('getOrder method exists', () {
      expect(service.getOrder, isA<Function>());
    });

    test('createOrder method exists', () {
      expect(service.createOrder, isA<Function>());
    });

    test('cancelOrder method exists', () {
      expect(service.cancelOrder, isA<Function>());
    });
  });
}
