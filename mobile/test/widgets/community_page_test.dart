import 'package:flutter_test/flutter_test.dart';
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
