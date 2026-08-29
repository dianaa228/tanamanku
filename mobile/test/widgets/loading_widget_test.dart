import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/widgets/loading_widget.dart';

void main() {
  group('LoadingWidget', () {
    Widget buildWidget({String? label, double size = 40}) {
      return MaterialApp(
        home: Scaffold(
          body: LoadingWidget(label: label, size: size),
        ),
      );
    }

    testWidgets('renders CircularProgressIndicator', (tester) async {
      await tester.pumpWidget(buildWidget());
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('does not render label when null', (tester) async {
      await tester.pumpWidget(buildWidget());
      expect(find.byType(Text), findsNothing);
    });

    testWidgets('renders label when provided', (tester) async {
      await tester.pumpWidget(buildWidget(label: 'Loading...'));
      expect(find.text('Loading...'), findsOneWidget);
    });

    testWidgets('has correct size', (tester) async {
      await tester.pumpWidget(buildWidget(size: 60));
      final indicator = tester.widget<CircularProgressIndicator>(
        find.byType(CircularProgressIndicator),
      );
      expect(indicator, isNotNull);
    });
  });
}
