import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tanamanku/features/auth/auth_provider.dart';
import 'package:tanamanku/features/profile/profile_page.dart';

void main() {
  Widget buildTestApp({AuthProvider? auth}) {
    return ChangeNotifierProvider(
      create: (_) => auth ?? AuthProvider(),
      child: const MaterialApp(
        home: Scaffold(body: ProfilePage()),
      ),
    );
  }

  group('ProfilePage', () {
    testWidgets('renders login prompt when not authenticated', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(milliseconds: 500));
      expect(find.text('Masuk dulu yuk'), findsOneWidget);
      expect(find.text('Masuk untuk mengakses profil & kebunmu'), findsOneWidget);
    });

    testWidgets('renders login and register buttons when not authenticated', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(milliseconds: 500));
      expect(find.text('Masuk'), findsOneWidget);
      expect(find.text('Daftar'), findsOneWidget);
    });

    testWidgets('renders lock emoji when not authenticated', (tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(const Duration(milliseconds: 500));
      expect(find.text('🔐'), findsOneWidget);
    });
  });
}
