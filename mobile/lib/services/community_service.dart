import '../core/network/api_client.dart';
import '../models/post_model.dart';

/// Service komunitas — mengonsumsi /api/v1/community.
class CommunityService {
  final _api = ApiClient();

  /// Ambil daftar post: GET /community/posts
  Future<List<PostModel>> getPosts({int perPage = 30}) async {
    final res = await _api.get('/community/posts', queryParameters: {'per_page': perPage});
    final data = res.data['data'];
    final list = data is Map && data['data'] is List ? data['data'] : (data is List ? data : []);
    return list.map((e) => PostModel.fromJson(e)).toList();
  }

  /// Buat post: POST /community/posts
  Future<PostModel> createPost(String content) async {
    final res = await _api.post('/community/posts', data: {'content': content});
    return PostModel.fromJson(res.data['data']);
  }

  /// Toggle like: POST /community/posts/{id}/like
  Future<void> toggleLike(int postId) async {
    await _api.post('/community/posts/$postId/like');
  }

  /// Tambah komentar: POST /community/posts/{id}/comments
  Future<CommentModel> addComment(int postId, String content) async {
    final res = await _api.post('/community/posts/$postId/comments', data: {
      'content': content,
    });
    return CommentModel.fromJson(res.data['data']);
  }

  /// Hapus komentar: DELETE /comments/{id}
  Future<void> deleteComment(int commentId) async {
    await _api.delete('/comments/$commentId');
  }

  /// Laporkan post: POST /community/posts/{id}/report
  Future<void> reportPost(int postId, String reason) async {
    await _api.post('/community/posts/$postId/report', data: {'reason': reason});
  }
}
