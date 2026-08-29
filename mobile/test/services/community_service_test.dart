import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/community_service.dart';

void main() {
  group('CommunityService', () {
    late CommunityService service;

    setUp(() {
      service = CommunityService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<CommunityService>());
    });

    test('getPosts method exists', () {
      expect(service.getPosts, isA<Function>());
    });

    test('createPost method exists', () {
      expect(service.createPost, isA<Function>());
    });

    test('toggleLike method exists', () {
      expect(service.toggleLike, isA<Function>());
    });

    test('addComment method exists', () {
      expect(service.addComment, isA<Function>());
    });

    test('deleteComment method exists', () {
      expect(service.deleteComment, isA<Function>());
    });

    test('reportPost method exists', () {
      expect(service.reportPost, isA<Function>());
    });
  });
}
