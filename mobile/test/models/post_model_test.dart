import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/post_model.dart';

void main() {
  group('PostModel', () {
    test('fromJson parses post correctly', () {
      final json = {
        'id': 1,
        'user_id': 10,
        'content': 'Lihat tanaman monstera ku!',
        'likes_count': 25,
        'comments_count': 5,
        'created_at': '2026-01-15T10:30:00.000000Z',
        'user': {
          'id': 10,
          'name': 'Budi',
          'avatar': 'https://example.com/avatar.jpg',
        },
        'images': [
          {'id': 1, 'path': 'https://example.com/post1.jpg', 'sort_order': 0},
        ],
        'comments': [
          {
            'id': 1,
            'post_id': 1,
            'user_id': 20,
            'content': 'Bagus banget!',
            'user': {'id': 20, 'name': 'Andi'},
          }
        ],
      };

      final post = PostModel.fromJson(json);

      expect(post.id, 1);
      expect(post.userId, 10);
      expect(post.content, 'Lihat tanaman monstera ku!');
      expect(post.likesCount, 25);
      expect(post.commentsCount, 5);
      expect(post.createdAt, isNotNull);
      expect(post.user, isNotNull);
      expect(post.user!.name, 'Budi');
      expect(post.images.length, 1);
      expect(post.comments.length, 1);
    });

    test('fromJson handles missing fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'user_id': 10,
        'content': 'Test',
      };

      final post = PostModel.fromJson(json);

      expect(post.likesCount, 0);
      expect(post.commentsCount, 0);
      expect(post.user, isNull);
      expect(post.images, isEmpty);
      expect(post.comments, isEmpty);
    });
  });

  group('PostUserModel', () {
    test('fromJson parses correctly', () {
      final user = PostUserModel.fromJson({
        'id': 1,
        'name': 'Budi',
        'avatar': 'https://example.com/avatar.jpg',
      });

      expect(user.id, 1);
      expect(user.name, 'Budi');
      expect(user.avatar, 'https://example.com/avatar.jpg');
    });
  });

  group('CommentModel', () {
    test('fromJson parses correctly', () {
      final comment = CommentModel.fromJson({
        'id': 1,
        'post_id': 10,
        'user_id': 20,
        'content': 'Keren!',
        'created_at': '2026-01-15T11:00:00.000000Z',
        'user': {'id': 20, 'name': 'Andi'},
      });

      expect(comment.id, 1);
      expect(comment.postId, 10);
      expect(comment.userId, 20);
      expect(comment.content, 'Keren!');
      expect(comment.user, isNotNull);
      expect(comment.user!.name, 'Andi');
    });
  });
}
