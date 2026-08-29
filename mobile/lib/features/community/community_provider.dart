import 'package:flutter/material.dart';
import '../../models/post_model.dart';
import '../../services/community_service.dart';

/// Provider komunitas — mengelola post, like, komentar.
class CommunityProvider extends ChangeNotifier {
  final _service = CommunityService();

  List<PostModel> _posts = [];
  bool _loading = false;
  bool _sending = false;
  String? _error;

  List<PostModel> get posts => _posts;
  bool get loading => _loading;
  bool get sending => _sending;
  String? get error => _error;

  /// Muat daftar post.
  Future<void> loadPosts() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _posts = await _service.getPosts();
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Buat post baru.
  Future<bool> createPost(String content) async {
    if (content.trim().isEmpty) return false;
    _sending = true;
    _error = null;
    notifyListeners();

    try {
      final post = await _service.createPost(content.trim());
      _posts.insert(0, post);
      _sending = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      _sending = false;
      notifyListeners();
      return false;
    }
  }

  /// Toggle like pada post.
  Future<void> toggleLike(int postId) async {
    try {
      await _service.toggleLike(postId);
      // Refresh posts untuk update like count
      await loadPosts();
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
    }
  }

  /// Tambah komentar.
  Future<bool> addComment(int postId, String content) async {
    if (content.trim().isEmpty) return false;
    try {
      await _service.addComment(postId, content.trim());
      await loadPosts(); // refresh
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Hapus komentar.
  Future<bool> deleteComment(int commentId) async {
    try {
      await _service.deleteComment(commentId);
      await loadPosts();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  String _extractError(dynamic e) {
    try {
      if (e is Exception) {
        final dynamic dioError = e;
        if (dioError.response?.data?['message'] != null) {
          return dioError.response!.data['message'] as String;
        }
      }
    } catch (_) {}
    return 'Terjadi kesalahan. Coba lagi.';
  }
}
