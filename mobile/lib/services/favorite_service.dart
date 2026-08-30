import '../core/network/api_client.dart';
import '../models/favorite_model.dart';

/// Service favorit produk — mengonsumsi /api/v1/favorites.
class FavoriteService {
  final _api = ApiClient();

  /// Ambil daftar favorit: GET /favorites
  Future<List<FavoriteModel>> getFavorites() async {
    final res = await _api.get('/favorites');
    final data = res.data['data'];
    if (data is List) {
      return data.map((e) => FavoriteModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return [];
  }

  /// Toggle favorit: POST /favorites/{productId}
  Future<bool> toggleFavorite(int productId) async {
    final res = await _api.post('/favorites/$productId');
    return res.data['data']?['is_favorite'] ?? false;
  }

  /// Cek apakah produk difavoritkan: GET /favorites/check/{productId}
  Future<bool> isFavorite(int productId) async {
    final res = await _api.get('/favorites/check/$productId');
    return res.data['data']?['is_favorite'] ?? false;
  }
}
