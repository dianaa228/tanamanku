import '../core/network/api_client.dart';

/// Model untuk Nursery
class NurseryModel {
  final int id;
  final String name;
  final String? slug;
  final String? description;
  final String? address;
  final String? phone;
  final String? whatsapp;
  final double? latitude;
  final double? longitude;
  final bool isActive;

  NurseryModel({
    required this.id,
    required this.name,
    this.slug,
    this.description,
    this.address,
    this.phone,
    this.whatsapp,
    this.latitude,
    this.longitude,
    required this.isActive,
  });

  factory NurseryModel.fromJson(Map<String, dynamic> json) {
    return NurseryModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'],
      description: json['description'],
      address: json['address'],
      phone: json['phone'],
      whatsapp: json['whatsapp'],
      latitude: json['latitude'] != null ? double.tryParse(json['latitude'].toString()) : null,
      longitude: json['longitude'] != null ? double.tryParse(json['longitude'].toString()) : null,
      isActive: json['is_active'] ?? true,
    );
  }
}

/// Model untuk Nursery Product
class NurseryProductModel {
  final int id;
  final String name;
  final double? price;
  final String? description;
  final int? stock;

  NurseryProductModel({
    required this.id,
    required this.name,
    this.price,
    this.description,
    this.stock,
  });

  factory NurseryProductModel.fromJson(Map<String, dynamic> json) {
    return NurseryProductModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      price: json['price'] != null ? double.tryParse(json['price'].toString()) : null,
      description: json['description'],
      stock: json['stock'],
    );
  }
}

/// Service Nursery API
class NurseryService {
  final _api = ApiClient();

  /// GET /nurseries
  Future<List<NurseryModel>> getNurseries({String? search}) async {
    final res = await _api.get('/nurseries', queryParameters: {
      if (search != null) 'search': search,
    });
    final data = res.data['data'];
    return (data as List).map((e) => NurseryModel.fromJson(e)).toList();
  }

  /// GET /nurseries/{idOrSlug}
  Future<NurseryModel> getNursery(String idOrSlug) async {
    final res = await _api.get('/nurseries/$idOrSlug');
    return NurseryModel.fromJson(res.data['data']);
  }

  /// GET /nurseries/{id}/products
  Future<List<NurseryProductModel>> getProducts(int nurseryId) async {
    final res = await _api.get('/nurseries/$nurseryId/products');
    final data = res.data['data'];
    return (data as List).map((e) => NurseryProductModel.fromJson(e)).toList();
  }
}
