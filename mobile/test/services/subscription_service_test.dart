import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/subscription_service.dart';

void main() {
  group('SubscriptionPlanModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'name': 'Premium',
        'price': 99000,
        'duration_months': 1,
        'features': ['Unlimited listings', 'Priority support'],
        'badge': '👑',
      };

      final plan = SubscriptionPlanModel.fromJson(json);

      expect(plan.id, 1);
      expect(plan.name, 'Premium');
      expect(plan.price, 99000);
      expect(plan.durationMonths, 1);
      expect(plan.features.length, 2);
      expect(plan.badge, '👑');
    });

    test('fromJson handles missing fields', () {
      final plan = SubscriptionPlanModel.fromJson({'id': 1, 'name': 'Basic'});
      expect(plan.price, 0);
      expect(plan.durationMonths, 1);
      expect(plan.features, isEmpty);
      expect(plan.badge, isNull);
    });
  });

  group('UserSubscriptionModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'plan_id': 2,
        'status': 'active',
        'expires_at': '2026-12-31',
        'plan': {
          'id': 2,
          'name': 'Premium',
          'price': 99000,
          'duration_months': 1,
          'features': [],
        },
      };

      final sub = UserSubscriptionModel.fromJson(json);

      expect(sub.id, 1);
      expect(sub.planId, 2);
      expect(sub.status, 'active');
      expect(sub.expiresAt, '2026-12-31');
      expect(sub.plan, isNotNull);
      expect(sub.plan!.name, 'Premium');
    });
  });

  group('BillingModel', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 1,
        'amount': 99000,
        'status': 'paid',
        'description': 'Premium subscription',
        'created_at': '2026-01-15',
      };

      final billing = BillingModel.fromJson(json);

      expect(billing.id, 1);
      expect(billing.amount, 99000);
      expect(billing.status, 'paid');
      expect(billing.description, 'Premium subscription');
    });
  });

  group('SubscriptionApiService', () {
    late SubscriptionApiService service;

    setUp(() {
      service = SubscriptionApiService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<SubscriptionApiService>());
    });

    test('getPlans method exists', () {
      expect(service.getPlans, isA<Function>());
    });

    test('getCurrent method exists', () {
      expect(service.getCurrent, isA<Function>());
    });

    test('subscribe method exists', () {
      expect(service.subscribe, isA<Function>());
    });

    test('cancel method exists', () {
      expect(service.cancel, isA<Function>());
    });

    test('getBilling method exists', () {
      expect(service.getBilling, isA<Function>());
    });
  });
}
