import 'category_model.dart';

class ProductModel {
  final int id;
  final String name;
  final String slug;
  final String? description;
  final double price;
  final int stock;
  final String careLevel;
  final bool isActive;
  final StoreInfo? store;
  final CategoryModel? category;
  final List<ProductImage> images;
  final List<ProductVariant> variants;
  final double ratingAvg;
  final int soldCount;

  ProductModel({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.price = 0,
    this.stock = 0,
    this.careLevel = 'mudah',
    this.isActive = true,
    this.store,
    this.category,
    this.images = const [],
    this.variants = const [],
    this.ratingAvg = 0,
    this.soldCount = 0,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      price: (json['price'] ?? 0).toDouble(),
      stock: json['stock'] ?? 0,
      careLevel: json['care_level'] ?? 'mudah',
      isActive: json['is_active'] ?? true,
      store: json['store'] != null ? StoreInfo.fromJson(json['store']) : null,
      category: json['category'] != null ? CategoryModel.fromJson(json['category']) : null,
      images: (json['images'] as List<dynamic>?)
          ?.map((e) => ProductImage.fromJson(e))
          .toList() ?? [],
      variants: (json['variants'] as List<dynamic>?)
          ?.map((e) => ProductVariant.fromJson(e))
          .toList() ?? [],
      ratingAvg: (json['rating_avg'] ?? 0).toDouble(),
      soldCount: json['sold_count'] ?? 0,
    );
  }

  String get imageUrl {
    if (images.isNotEmpty) return images.first.path;
    return '';
  }
}

class StoreInfo {
  final int id;
  final String name;
  final String? slug;

  StoreInfo({required this.id, required this.name, this.slug});

  factory StoreInfo.fromJson(Map<String, dynamic> json) {
    return StoreInfo(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'],
    );
  }
}

class ProductImage {
  final int id;
  final String path;
  final int sortOrder;
  final bool isPrimary;

  ProductImage({
    required this.id,
    required this.path,
    this.sortOrder = 0,
    this.isPrimary = false,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      id: json['id'] ?? 0,
      path: json['path'] ?? '',
      sortOrder: json['sort_order'] ?? 0,
      isPrimary: json['is_primary'] ?? false,
    );
  }
}

class ProductVariant {
  final int id;
  final String name;
  final double priceAdjustment;
  final int stock;

  ProductVariant({
    required this.id,
    required this.name,
    this.priceAdjustment = 0,
    this.stock = 0,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      priceAdjustment: (json['price_adjustment'] ?? 0).toDouble(),
      stock: json['stock'] ?? 0,
    );
  }
}
