import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/orders/order_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('OrderProvider', () {
    late OrderProvider provider;

    setUp(() {
      provider = OrderProvider();
    });

    test('initial state has empty orders', () {
      expect(provider.orders, isEmpty);
      expect(provider.currentOrder, isNull);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });

    test('ordersByStatus returns all when status is semua', () {
      final result = provider.ordersByStatus('semua');
      expect(result, isEmpty);
    });

    test('ordersByStatus filters by status', () {
      final result = provider.ordersByStatus('pending');
      expect(result, isEmpty);
    });
  });
}
