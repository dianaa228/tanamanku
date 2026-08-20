import '../core/network/api_client.dart';
import '../models/product_model.dart';
import '../models/category_model.dart';
import '../models/plant_species_model.dart';

/// Service produk & katalog — mengonsumsi /api/v1/products, /categories, /plant-species.
class ProductService {
  final _api = ApiClient();

  /// Ambil daftar kategori: GET /categories
  Future<List<CategoryModel>> getCategories() async {
    final res = await _api.get('/categories');
    final list = res.data['data'];
    if (list is List) {
      return list.map((e) => CategoryModel.fromJson(e)).toList();
    }
    return [];
  }

  /// Ambil daftar produk dengan filter: GET /products
  Future<List<ProductModel>> getProducts({
    String? search,
    String? category,
    String? care,
    String? sort,
    int perPage = 60,
  }) async {
    final params = <String, dynamic>{
      'per_page': perPage,
    };
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (category != null && category.isNotEmpty) params['category'] = category;
    if (care != null && care.isNotEmpty) params['care'] = care;
    if (sort != null && sort.isNotEmpty) params['sort'] = sort;

    final res = await _api.get('/products', queryParameters: params);
    final data = res.data['data'];
    final list = data is Map && data['data'] is List ? data['data'] : (data is List ? data : []);
    return list.map((e) => ProductModel.fromJson(e)).toList();
  }

  /// Detail produk: GET /products/{slug}
  Future<ProductModel> getProduct(String slug) async {
    final res = await _api.get('/products/$slug');
    return ProductModel.fromJson(res.data['data']);
  }

  /// Produk per toko: GET /stores/{store}/products
  Future<List<ProductModel>> getProductsByStore(int storeId) async {
    final res = await _api.get('/stores/$storeId/products');
    final data = res.data['data'];
    final list = data is Map && data['data'] is List ? data['data'] : (data is List ? data : []);
    return list.map((e) => ProductModel.fromJson(e)).toList();
  }

  /// Toggle favorit: POST /products/{product}/favorite
  Future<bool> toggleFavorite(int productId) async {
    final res = await _api.post('/products/$productId/favorite');
    return res.data['data']?['is_favorite'] ?? false;
  }

  /// Ambil daftar spesies tanaman: GET /plant-species
  Future<List<PlantSpeciesModel>> getPlantSpecies() async {
    final res = await _api.get('/plant-species');
    final data = res.data['data'];
    final list = data is List ? data : [];
    return list.map((e) => PlantSpeciesModel.fromJson(e)).toList();
  }

  /// Detail spesies: GET /plant-species/{slug}
  Future<PlantSpeciesModel> getSpecies(String slug) async {
    final res = await _api.get('/plant-species/$slug');
    return PlantSpeciesModel.fromJson(res.data['data']);
  }
}
