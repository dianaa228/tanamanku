import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/subscription_service.dart';

void main() {
  group('SubscriptionService', () {
    late SubscriptionService service;

    setUp(() {
      service = SubscriptionService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<SubscriptionService>());
    });

    test('getPlans method exists', () {
      expect(service.getPlans, isA<Function>());
    });

    test('getCurrentSubscription method exists', () {
      expect(service.getCurrentSubscription, isA<Function>());
    });

    test('subscribe method exists', () {
      expect(service.subscribe, isA<Function>());
    });

    test('cancelSubscription method exists', () {
      expect(service.cancelSubscription, isA<Function>());
    });

    test('getBillingHistory method exists', () {
      expect(service.getBillingHistory, isA<Function>());
    });
  });
}
