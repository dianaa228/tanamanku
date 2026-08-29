import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/features/cart/cart_page.dart';
import 'package:tanamanku/features/cart/cart_provider.dart';

void main() {
  group('CartPage', () {
    testWidgets('can be instantiated', (tester) async {
      expect(CartPage, isA<Type>());
      expect(CartProvider, isA<Type>());
    });
  });
}
