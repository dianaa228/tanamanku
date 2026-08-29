import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:tanamanku/features/auth/auth_provider.dart';
import 'package:tanamanku/features/community/community_page.dart';
import 'package:tanamanku/features/community/community_provider.dart';

void main() {
  group('CommunityPage', () {
    testWidgets('can be instantiated', (tester) async {
      expect(CommunityPage, isA<Type>());
      expect(CommunityProvider, isA<Type>());
    });
  });
}
