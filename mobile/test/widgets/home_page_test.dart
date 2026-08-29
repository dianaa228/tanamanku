import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tanamanku/features/auth/auth_provider.dart';
import 'package:tanamanku/features/marketplace/marketplace_provider.dart';
import 'package:tanamanku/features/home/home_page.dart';

void main() {
  Widget buildTestApp({AuthProvider? auth, MarketplaceProvider? marketplace}) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => auth ?? AuthProvider()),
        ChangeNotifierProvider(create: (_) => marketplace ?? MarketplaceProvider()),
      ],
      child: const MaterialApp(home: Scaffold(body: HomePage())),
    );
  }

  group('HomePage', () {
    testWidgets('renders greeting', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(seconds: 2));
      expect(find.textContaining('Halo'), findsOneWidget);
    });

    testWidgets('renders hero tagline', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(seconds: 2));
      expect(find.textContaining('Tumbuhkan kebun'), findsOneWidget);
    });

    testWidgets('renders action buttons', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(seconds: 2));
      expect(find.text('Mulai belanja'), findsOneWidget);
      expect(find.text('Cari tanaman'), findsOneWidget);
    });

    testWidgets('renders promo banners', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(seconds: 2));
      expect(find.textContaining('Promo menarik'), findsWidgets);
      expect(find.textContaining('Gratis Ongkir'), findsWidgets);
    });

    testWidgets('renders quick access', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(seconds: 2));
      expect(find.textContaining('Akses cepat'), findsWidgets);
      expect(find.text('Diagnosis'), findsOneWidget);
      expect(find.text('Exchange'), findsOneWidget);
      expect(find.text('Rewards'), findsOneWidget);
      expect(find.text('Jasa'), findsOneWidget);
    });

    testWidgets('renders stats', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(seconds: 2));
      expect(find.text('500+'), findsOneWidget);
      expect(find.text('120+'), findsOneWidget);
      expect(find.text('10rb+'), findsOneWidget);
      expect(find.text('4.9★'), findsOneWidget);
    });
  });
}
