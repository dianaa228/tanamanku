import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/nursery_service.dart';

void main() {
  group('NurseryModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'name': 'Green Garden Nursery',
        'slug': 'green-garden-nursery',
        'description': 'Nursery terlengkap',
        'address': 'Jl. Raya No. 1',
        'phone': '08123456789',
        'whatsapp': '08123456789',
        'latitude': -6.9175,
        'longitude': 107.6191,
        'is_active': true,
      };

      final nursery = NurseryModel.fromJson(json);

      expect(nursery.id, 1);
      expect(nursery.name, 'Green Garden Nursery');
      expect(nursery.slug, 'green-garden-nursery');
      expect(nursery.description, 'Nursery terlengkap');
      expect(nursery.address, 'Jl. Raya No. 1');
      expect(nursery.phone, '08123456789');
      expect(nursery.latitude, -6.9175);
      expect(nursery.longitude, 107.6191);
      expect(nursery.isActive, true);
    });

    test('fromJson handles missing optional fields', () {
      final nursery = NurseryModel.fromJson({'id': 1, 'name': 'Test', 'is_active': true});
      expect(nursery.slug, isNull);
      expect(nursery.latitude, isNull);
      expect(nursery.phone, isNull);
    });
  });

  group('NurseryProductModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'name': 'Monstera',
        'price': 145000,
        'description': 'Tanaman sehat',
        'stock': 25,
      };

      final product = NurseryProductModel.fromJson(json);

      expect(product.id, 1);
      expect(product.name, 'Monstera');
      expect(product.price, 145000);
      expect(product.description, 'Tanaman sehat');
      expect(product.stock, 25);
    });
  });

  group('NurseryService', () {
    late NurseryService service;

    setUp(() {
      service = NurseryService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<NurseryService>());
    });

    test('getNurseries method exists', () {
      expect(service.getNurseries, isA<Function>());
    });

    test('getNursery method exists', () {
      expect(service.getNursery, isA<Function>());
    });

    test('getProducts method exists', () {
      expect(service.getProducts, isA<Function>());
    });
  });
}
