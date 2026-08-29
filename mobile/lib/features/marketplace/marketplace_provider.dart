import 'package:flutter/material.dart';
import '../../models/product_model.dart';
import '../../models/category_model.dart';
import '../../models/plant_species_model.dart';
import '../../services/product_service.dart';

/// Provider marketplace — mengelola produk, kategori, search, dan detail produk.
class MarketplaceProvider extends ChangeNotifier {
  final _service = ProductService();

  List<ProductModel> _products = [];
  List<CategoryModel> _categories = [];
  List<ProductModel> _featured = [];
  ProductModel? _currentProduct;
  List<PlantSpeciesModel> _plantSpecies = [];

  bool _loading = false;
  String? _error;

  // Filter state
  String _searchQuery = '';
  String _selectedCategory = '';
  String _selectedSort = 'relevansi';

  List<ProductModel> get products => _products;
  List<CategoryModel> get categories => _categories;
  List<ProductModel> get featured => _featured;
  ProductModel? get currentProduct => _currentProduct;
  List<PlantSpeciesModel> get plantSpecies => _plantSpecies;
  bool get loading => _loading;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;
  String get selectedSort => _selectedSort;

  /// Muat data awal (kategori + produk populer).
  Future<void> loadInitial() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _service.getCategories(),
        _service.getProducts(sort: 'terlaris', perPage: 8),
      ]);
      _categories = results[0] as List<CategoryModel>;
      _featured = results[1] as List<ProductModel>;
      _products = _featured;
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat produk dengan filter.
  Future<void> loadProducts({
    String? search,
    String? category,
    String? sort,
  }) async {
    _loading = true;
    _error = null;
    if (search != null) _searchQuery = search;
    if (category != null) _selectedCategory = category;
    if (sort != null) _selectedSort = sort;
    notifyListeners();

    try {
      _products = await _service.getProducts(
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
        category: _selectedCategory.isNotEmpty ? _selectedCategory : null,
        sort: _selectedSort,
      );
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat detail produk berdasarkan slug.
  Future<void> loadProduct(String slug) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _currentProduct = await _service.getProduct(slug);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Toggle favorit produk dan muat ulang data.
  Future<bool> toggleFavorite(int productId) async {
    try {
      await _service.toggleFavorite(productId);
      // Muat ulang data untuk update status favorit
      await loadProducts();
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Muat spesies tanaman untuk Plant Finder.
  Future<void> loadPlantSpecies() async {
    try {
      _plantSpecies = await _service.getPlantSpecies();
      notifyListeners();
    } catch (_) {}
  }

  /// Set search query dan reload.
  void setSearch(String query) {
    _searchQuery = query;
    loadProducts();
  }

  /// Set kategori dan reload.
  void setCategory(String category) {
    _selectedCategory = category;
    loadProducts();
  }

  /// Set sort dan reload.
  void setSort(String sort) {
    _selectedSort = sort;
    loadProducts();
  }

  /// Reset filter.
  void resetFilters() {
    _searchQuery = '';
    _selectedCategory = '';
    _selectedSort = 'relevansi';
    loadProducts();
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
    return 'Gagal memuat data. Coba lagi.';
  }
}
