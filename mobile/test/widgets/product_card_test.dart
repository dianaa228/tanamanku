import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/widgets/product_card.dart';
import 'package:tanamanku/models/product_model.dart';

void main() {
  group('ProductCard', () {
    Widget buildCard({required ProductModel product, bool compact = false}) {
      return MaterialApp(
        home: Scaffold(
          body: ProductCard(product: product, compact: compact),
        ),
      );
    }

    ProductModel makeProduct({
      String name = 'Monstera Deliciosa',
      double price = 145000,
      int stock = 25,
      double ratingAvg = 4.5,
      int soldCount = 120,
    }) {
      return ProductModel(
        id: 1,
        name: name,
        slug: name.toLowerCase().replaceAll(' ', '-'),
        price: price,
        stock: stock,
        ratingAvg: ratingAvg,
        soldCount: soldCount,
      );
    }

    testWidgets('renders product name', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(name: 'Monstera Deliciosa'),
      ));
      expect(find.text('Monstera Deliciosa'), findsOneWidget);
    });

    testWidgets('renders price with rupiah format', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(price: 145000),
      ));
      expect(find.textContaining('Rp'), findsOneWidget);
    });

    testWidgets('renders rating', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(ratingAvg: 4.5),
      ));
      expect(find.text('4.5'), findsOneWidget);
    });

    testWidgets('renders sold count', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(soldCount: 120),
      ));
      expect(find.textContaining('terjual'), findsOneWidget);
    });

    testWidgets('shows low stock warning when stock <= 5', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(stock: 3),
      ));
      expect(find.textContaining('Sisa'), findsOneWidget);
    });

    testWidgets('hides low stock warning when stock > 5', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(stock: 25),
      ));
      expect(find.textContaining('Sisa'), findsNothing);
    });

    testWidgets('renders emoji based on product name', (tester) async {
      await tester.pumpWidget(buildCard(
        product: makeProduct(name: 'Monstera Deliciosa'),
      ));
      expect(find.text('🌿'), findsOneWidget);
    });
  });
}
