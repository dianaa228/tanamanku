import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/cart/cart_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('CartProvider', () {
    late CartProvider provider;

    setUp(() {
      provider = CartProvider();
    });

    test('initial state has no cart', () {
      expect(provider.cart, isNull);
      expect(provider.isEmpty, true);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });

    test('initial successMessage is null', () {
      expect(provider.successMessage, isNull);
    });

    test('itemCount is 0 when cart is null', () {
      expect(provider.itemCount, 0);
    });

    test('subtotal is 0 when cart is null', () {
      expect(provider.subtotal, 0);
    });

    test('clearMessages resets messages', () {
      provider.clearMessages();
      expect(provider.successMessage, isNull);
      expect(provider.error, isNull);
    });
  });
}
