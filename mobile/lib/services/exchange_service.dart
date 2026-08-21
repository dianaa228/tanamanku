import '../core/network/api_client.dart';

/// Model untuk Plant Listing
class PlantListingModel {
  final int id;
  final int userId;
  final int? plantSpeciesId;
  final String title;
  final String? description;
  final double? price;
  final String type;
  final String status;
  final Map<String, dynamic>? owner;
  final Map<String, dynamic>? species;
  final String? createdAt;

  PlantListingModel({
    required this.id,
    required this.userId,
    this.plantSpeciesId,
    required this.title,
    this.description,
    this.price,
    required this.type,
    required this.status,
    this.owner,
    this.species,
    this.createdAt,
  });

  factory PlantListingModel.fromJson(Map<String, dynamic> json) {
    return PlantListingModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      plantSpeciesId: json['plant_species_id'],
      title: json['title'] ?? '',
      description: json['description'],
      price: json['price'] != null ? double.tryParse(json['price'].toString()) : null,
      type: json['type'] ?? 'sell',
      status: json['status'] ?? 'active',
      owner: json['owner'],
      species: json['species'],
      createdAt: json['created_at'],
    );
  }
}

/// Model untuk Plant Exchange (tawaran)
class PlantExchangeModel {
  final int id;
  final int listingId;
  final int offererId;
  final String? message;
  final String status;
  final Map<String, dynamic>? listing;
  final Map<String, dynamic>? offerer;
  final String? createdAt;

  PlantExchangeModel({
    required this.id,
    required this.listingId,
    required this.offererId,
    this.message,
    required this.status,
    this.listing,
    this.offerer,
    this.createdAt,
  });

  factory PlantExchangeModel.fromJson(Map<String, dynamic> json) {
    return PlantExchangeModel(
      id: json['id'] ?? 0,
      listingId: json['listing_id'] ?? 0,
      offererId: json['offerer_id'] ?? 0,
      message: json['message'],
      status: json['status'] ?? 'pending',
      listing: json['listing'],
      offerer: json['offerer'],
      createdAt: json['created_at'],
    );
  }
}

/// Service Plant Exchange
class ExchangeService {
  final _api = ApiClient();

  /// GET /plant-exchange/listings
  Future<List<PlantListingModel>> getListings({String? type}) async {
    final res = await _api.get('/plant-exchange/listings', queryParameters: {
      if (type != null) 'type': type,
    });
    final data = res.data['data'];
    final items = data is Map ? (data['data'] ?? []) : (data ?? []);
    return (items as List).map((e) => PlantListingModel.fromJson(e)).toList();
  }

  /// GET /plant-exchange/listings/{id}
  Future<PlantListingModel> getListing(int id) async {
    final res = await _api.get('/plant-exchange/listings/$id');
    return PlantListingModel.fromJson(res.data['data']);
  }

  /// POST /plant-exchange/listings
  Future<PlantListingModel> createListing({
    required String title,
    String? description,
    double? price,
    required String type,
    int? plantSpeciesId,
  }) async {
    final res = await _api.post('/plant-exchange/listings', data: {
      'title': title,
      if (description != null) 'description': description,
      if (price != null) 'price': price,
      'type': type,
      if (plantSpeciesId != null) 'plant_species_id': plantSpeciesId,
    });
    return PlantListingModel.fromJson(res.data['data']);
  }

  /// POST /plant-exchange/listings/{id}/offer
  Future<void> makeOffer(int listingId, {String? message}) async {
    await _api.post('/plant-exchange/listings/$listingId/offer', data: {
      if (message != null) 'message': message,
    });
  }

  /// GET /plant-exchange/listings/mine
  Future<List<PlantListingModel>> getMyListings() async {
    final res = await _api.get('/plant-exchange/listings/mine');
    final data = res.data['data'];
    return (data as List).map((e) => PlantListingModel.fromJson(e)).toList();
  }

  /// GET /plant-exchange/exchanges/mine
  Future<List<PlantExchangeModel>> getMyExchanges() async {
    final res = await _api.get('/plant-exchange/exchanges/mine');
    final data = res.data['data'];
    return (data as List).map((e) => PlantExchangeModel.fromJson(e)).toList();
  }

  /// PUT /plant-exchange/exchanges/{id}
  Future<void> respondToExchange(int exchangeId, String status) async {
    await _api.put('/plant-exchange/exchanges/$exchangeId', data: {
      'status': status,
    });
  }
}
