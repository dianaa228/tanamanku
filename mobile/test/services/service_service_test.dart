import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/service_service.dart';

void main() {
  group('GardeningServiceModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'provider_id': 10,
        'category': 'landscaping',
        'name': 'Landscape Design',
        'description': 'Desain taman profesional',
        'price_per_visit': 500000,
        'duration': 120,
        'service_area': 'Bandung',
        'is_active': true,
      };

      final service = GardeningServiceModel.fromJson(json);

      expect(service.id, 1);
      expect(service.providerId, 10);
      expect(service.category, 'landscaping');
      expect(service.name, 'Landscape Design');
      expect(service.pricePerVisit, 500000);
      expect(service.duration, 120);
      expect(service.serviceArea, 'Bandung');
      expect(service.isActive, true);
    });

    test('categoryIcon returns correct emoji', () {
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'landscaping', name: 'Test', isActive: true).categoryIcon, '🌳');
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'maintenance', name: 'Test', isActive: true).categoryIcon, '🔧');
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'planting', name: 'Test', isActive: true).categoryIcon, '🌱');
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'pest-control', name: 'Test', isActive: true).categoryIcon, '🐛');
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'consultation', name: 'Test', isActive: true).categoryIcon, '📋');
    });

    test('categoryLabel returns correct label', () {
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'landscaping', name: 'Test', isActive: true).categoryLabel, 'Landscaping');
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'maintenance', name: 'Test', isActive: true).categoryLabel, 'Perawatan');
      expect(GardeningServiceModel(id: 1, providerId: 1, category: 'planting', name: 'Test', isActive: true).categoryLabel, 'Penanaman');
    });
  });

  group('ServiceOrderModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'service_id': 10,
        'customer_id': 20,
        'schedule_at': '2026-01-20 10:00',
        'status': 'pending',
        'total': 500000,
        'note': 'Tolong tepat waktu',
      };

      final order = ServiceOrderModel.fromJson(json);

      expect(order.id, 1);
      expect(order.serviceId, 10);
      expect(order.customerId, 20);
      expect(order.scheduleAt, '2026-01-20 10:00');
      expect(order.status, 'pending');
      expect(order.total, 500000);
      expect(order.note, 'Tolong tepat waktu');
    });
  });

  group('GardeningApiService', () {
    late GardeningApiService service;

    setUp(() {
      service = GardeningApiService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<GardeningApiService>());
    });

    test('getServices method exists', () {
      expect(service.getServices, isA<Function>());
    });

    test('getService method exists', () {
      expect(service.getService, isA<Function>());
    });

    test('createBooking method exists', () {
      expect(service.createBooking, isA<Function>());
    });

    test('getMyBookings method exists', () {
      expect(service.getMyBookings, isA<Function>());
    });

    test('getBookingDetail method exists', () {
      expect(service.getBookingDetail, isA<Function>());
    });
  });
}
