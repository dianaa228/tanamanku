import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/widgets/app_button.dart';

void main() {
  group('AppButton', () {
    Widget buildButton({
      String label = 'Submit',
      VoidCallback? onPressed,
      bool loading = false,
      bool expanded = false,
      IconData? icon,
      AppButtonVariant variant = AppButtonVariant.primary,
    }) {
      return MaterialApp(
        home: Scaffold(
          body: AppButton(
            label: label,
            onPressed: onPressed,
            loading: loading,
            expanded: expanded,
            icon: icon,
            variant: variant,
          ),
        ),
      );
    }

    testWidgets('renders label text', (tester) async {
      await tester.pumpWidget(buildButton(label: 'Beli'));
      expect(find.text('Beli'), findsOneWidget);
    });

    testWidgets('calls onPressed when tapped', (tester) async {
      bool tapped = false;
      await tester.pumpWidget(buildButton(
        label: 'Submit',
        onPressed: () => tapped = true,
      ));
      await tester.tap(find.text('Submit'));
      expect(tapped, true);
    });

    testWidgets('shows loading indicator when loading', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Submit',
        loading: true,
        onPressed: () {},
      ));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Submit'), findsNothing);
    });

    testWidgets('disables button when loading', (tester) async {
      bool tapped = false;
      await tester.pumpWidget(buildButton(
        label: 'Submit',
        loading: true,
        onPressed: () => tapped = true,
      ));
      await tester.tap(find.byType(AppButton), warnIfMissed: false);
      expect(tapped, false);
    });

    testWidgets('renders icon when provided', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Add',
        icon: Icons.add,
      ));
      expect(find.byIcon(Icons.add), findsOneWidget);
      expect(find.text('Add'), findsOneWidget);
    });

    testWidgets('renders expanded button', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Full Width',
        expanded: true,
      ));
      final sizedBox = tester.widget<SizedBox>(find.byType(SizedBox).first);
      expect(sizedBox.width, double.infinity);
    });

    testWidgets('secondary variant renders OutlinedButton', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Cancel',
        variant: AppButtonVariant.secondary,
      ));
      expect(find.byType(OutlinedButton), findsOneWidget);
    });

    testWidgets('ghost variant renders TextButton', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Skip',
        variant: AppButtonVariant.ghost,
      ));
      expect(find.byType(TextButton), findsOneWidget);
    });

    testWidgets('danger variant renders ElevatedButton with red', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Delete',
        variant: AppButtonVariant.danger,
      ));
      expect(find.byType(ElevatedButton), findsOneWidget);
    });

    testWidgets('primary variant renders ElevatedButton', (tester) async {
      await tester.pumpWidget(buildButton(
        label: 'Save',
        variant: AppButtonVariant.primary,
      ));
      expect(find.byType(ElevatedButton), findsOneWidget);
    });
  });
}
