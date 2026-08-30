import '../core/network/api_client.dart';
import '../models/review_model.dart';

/// Service ulasan produk — mengonsumsi /api/v1/reviews.
class ReviewService {
  final _api = ApiClient();

  /// Ambil ulasan produk: GET /products/{productId}/reviews
  Future<List<ReviewModel>> getProductReviews(int productId) async {
    final res = await _api.get('/products/$productId/reviews');
    final data = res.data['data'];
    if (data is List) {
      return data.map((e) => ReviewModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return [];
  }

  /// Ambil ulasan saya: GET /reviews/mine
  Future<List<ReviewModel>> getMyReviews() async {
    final res = await _api.get('/reviews/mine');
    final data = res.data['data'];
    if (data is List) {
      return data.map((e) => ReviewModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return [];
  }

  /// Buat ulasan: POST /order-items/{orderItemId}/reviews
  Future<ReviewModel> createReview({
    required int orderItemId,
    required int rating,
    String? comment,
    List<String>? images,
  }) async {
    final res = await _api.post('/order-items/$orderItemId/reviews', data: {
      'rating': rating,
      if (comment != null) 'comment': comment,
      if (images != null) 'images': images,
    });
    return ReviewModel.fromJson(res.data['data']);
  }

  /// Hapus ulasan: DELETE /reviews/{id}
  Future<void> deleteReview(int reviewId) async {
    await _api.delete('/reviews/$reviewId');
  }
}
