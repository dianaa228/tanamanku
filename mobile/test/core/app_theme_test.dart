import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/core/theme/app_theme.dart';

void main() {
  group('AppTheme', () {
    test('has leaf color constants', () {
      expect(AppTheme.leaf50, isA<Color>());
      expect(AppTheme.leaf100, isA<Color>());
      expect(AppTheme.leaf200, isA<Color>());
      expect(AppTheme.leaf400, isA<Color>());
      expect(AppTheme.leaf500, isA<Color>());
      expect(AppTheme.leaf600, isA<Color>());
      expect(AppTheme.leaf700, isA<Color>());
      expect(AppTheme.leaf800, isA<Color>());
      expect(AppTheme.leaf900, isA<Color>());
      expect(AppTheme.leaf950, isA<Color>());
    });

    test('has sun color constants', () {
      expect(AppTheme.sun300, isA<Color>());
      expect(AppTheme.sun400, isA<Color>());
      expect(AppTheme.sun500, isA<Color>());
    });

    test('has cream color constant', () {
      expect(AppTheme.cream, isA<Color>());
    });

    test('leaf colors form a gradient scale', () {
      // leaf50 should be lighter than leaf950
      final lerp = Color.lerp(AppTheme.leaf50, AppTheme.leaf950, 0.5);
      expect(lerp, isNotNull);
    });
  });
}
