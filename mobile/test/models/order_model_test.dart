import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/order_model.dart';

void main() {
  group('OrderModel', () {
    test('fromJson parses order correctly', () {
      final json = {
        'id': 1,
        'order_number': 'ORD-20260115-001',
        'status': 'processing',
        'subtotal': 290000,
        'shipping_cost': 25000,
        'discount': 10000,
        'total': 305000,
        'payment_status': 'paid',
        'note': 'Tolong dibungkus rapi',
        'created_at': '2026-01-15T10:30:00.000000Z',
        'payment': {
          'method': 'bank_transfer',
          'reference': 'TRF-001',
          'amount': 305000,
          'status': 'paid',
        },
        'shipment': {
          'courier': 'jne',
          'tracking_number': 'JNE123456',
          'status': 'shipped',
        },
        'items': [
          {
            'id': 1,
            'product_id': 10,
            'quantity': 2,
            'unit_price': 145000,
            'subtotal': 290000,
          }
        ],
      };

      final order = OrderModel.fromJson(json);

      expect(order.id, 1);
      expect(order.orderNumber, 'ORD-20260115-001');
      expect(order.status, 'processing');
      expect(order.subtotal, 290000);
      expect(order.shippingCost, 25000);
      expect(order.discount, 10000);
      expect(order.total, 305000);
      expect(order.paymentStatus, 'paid');
      expect(order.note, 'Tolong dibungkus rapi');
      expect(order.createdAt, isNotNull);
      expect(order.payment, isNotNull);
      expect(order.payment!.method, 'bank_transfer');
      expect(order.shipment, isNotNull);
      expect(order.shipment!.courier, 'jne');
      expect(order.items.length, 1);
    });

    test('fromJson handles null payment and shipment', () {
      final json = {
        'id': 1,
        'order_number': 'ORD-001',
        'status': 'pending',
      };

      final order = OrderModel.fromJson(json);

      expect(order.payment, isNull);
      expect(order.shipment, isNull);
      expect(order.items, isEmpty);
      expect(order.subtotal, 0);
      expect(order.total, 0);
    });

    test('fromJson handles invalid created_at', () {
      final json = {
        'id': 1,
        'order_number': 'ORD-001',
        'status': 'pending',
        'created_at': 'invalid-date',
      };

      final order = OrderModel.fromJson(json);
      expect(order.createdAt, isNull);
    });
  });

  group('OrderItemModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'product_id': 10,
        'variant_id': 5,
        'quantity': 2,
        'unit_price': 145000,
        'subtotal': 290000,
        'product': {
          'id': 10,
          'name': 'Monstera',
          'slug': 'monstera',
        },
      };

      final item = OrderItemModel.fromJson(json);

      expect(item.id, 1);
      expect(item.productId, 10);
      expect(item.variantId, 5);
      expect(item.quantity, 2);
      expect(item.unitPrice, 145000);
      expect(item.subtotal, 290000);
      expect(item.product, isNotNull);
      expect(item.product!.name, 'Monstera');
    });
  });

  group('PaymentModel', () {
    test('fromJson parses correctly', () {
      final payment = PaymentModel.fromJson({
        'method': 'ewallet',
        'reference': 'GOPAY-001',
        'amount': 305000,
        'status': 'paid',
      });

      expect(payment.method, 'ewallet');
      expect(payment.reference, 'GOPAY-001');
      expect(payment.amount, 305000);
      expect(payment.status, 'paid');
    });

    test('fromJson handles nulls', () {
      final payment = PaymentModel.fromJson({});
      expect(payment.method, isNull);
      expect(payment.amount, isNull);
      expect(payment.status, 'pending');
    });
  });

  group('ShipmentModel', () {
    test('fromJson parses correctly', () {
      final shipment = ShipmentModel.fromJson({
        'courier': 'jne',
        'tracking_number': 'JNE123456',
        'status': 'shipped',
      });

      expect(shipment.courier, 'jne');
      expect(shipment.trackingNumber, 'JNE123456');
      expect(shipment.status, 'shipped');
    });

    test('fromJson handles nulls', () {
      final shipment = ShipmentModel.fromJson({});
      expect(shipment.courier, isNull);
      expect(shipment.trackingNumber, isNull);
      expect(shipment.status, 'pending');
    });
  });
}
