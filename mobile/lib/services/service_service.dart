import '../core/network/api_client.dart';

/// Model untuk Gardening Service
class GardeningServiceModel {
  final int id;
  final int providerId;
  final String category;
  final String name;
  final String? description;
  final double? pricePerVisit;
  final int? duration;
  final String? serviceArea;
  final bool isActive;

  GardeningServiceModel({
    required this.id,
    required this.providerId,
    required this.category,
    required this.name,
    this.description,
    this.pricePerVisit,
    this.duration,
    this.serviceArea,
    required this.isActive,
  });

  factory GardeningServiceModel.fromJson(Map<String, dynamic> json) {
    return GardeningServiceModel(
      id: json['id'] ?? 0,
      providerId: json['provider_id'] ?? 0,
      category: json['category'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      pricePerVisit: json['price_per_visit'] != null
          ? double.tryParse(json['price_per_visit'].toString())
          : null,
      duration: json['duration'],
      serviceArea: json['service_area'],
      isActive: json['is_active'] ?? true,
    );
  }

  String get categoryIcon {
    switch (category) {
      case 'landscaping': return '🌳';
      case 'maintenance': return '🔧';
      case 'planting': return '🌱';
      case 'pest-control': return '🐛';
      case 'consultation': return '📋';
      case 'delivery': return '🚚';
      default: return '🌿';
    }
  }

  String get categoryLabel {
    switch (category) {
      case 'landscaping': return 'Landscaping';
      case 'maintenance': return 'Perawatan';
      case 'planting': return 'Penanaman';
      case 'pest-control': return 'Pengendalian Hama';
      case 'consultation': return 'Konsultasi';
      case 'delivery': return 'Pengantaran';
      default: return category;
    }
  }
}

/// Model untuk Service Order (booking)
class ServiceOrderModel {
  final int id;
  final int serviceId;
  final int customerId;
  final String? scheduleAt;
  final String status;
  final double? total;
  final String? note;
  final GardeningServiceModel? service;
  final String? createdAt;

  ServiceOrderModel({
    required this.id,
    required this.serviceId,
    required this.customerId,
    this.scheduleAt,
    required this.status,
    this.total,
    this.note,
    this.service,
    this.createdAt,
  });

  factory ServiceOrderModel.fromJson(Map<String, dynamic> json) {
    return ServiceOrderModel(
      id: json['id'] ?? 0,
      serviceId: json['service_id'] ?? 0,
      customerId: json['customer_id'] ?? 0,
      scheduleAt: json['schedule_at'],
      status: json['status'] ?? 'pending',
      total: json['total'] != null ? double.tryParse(json['total'].toString()) : null,
      note: json['note'],
      service: json['service'] != null ? GardeningServiceModel.fromJson(json['service']) : null,
      createdAt: json['created_at'],
    );
  }
}

/// Service Gardening Services API
class GardeningApiService {
  final _api = ApiClient();

  /// GET /services
  Future<List<GardeningServiceModel>> getServices({String? category}) async {
    final res = await _api.get('/services', queryParameters: {
      if (category != null) 'category': category,
    });
    final data = res.data['data'];
    final items = data is Map ? (data['data'] ?? []) : (data ?? []);
    return (items as List).map((e) => GardeningServiceModel.fromJson(e)).toList();
  }

  /// GET /services/{id}
  Future<GardeningServiceModel> getService(int id) async {
    final res = await _api.get('/services/$id');
    return GardeningServiceModel.fromJson(res.data['data']);
  }

  /// POST /service-orders
  Future<ServiceOrderModel> createBooking({
    required int serviceId,
    required String scheduleAt,
    required Map<String, dynamic> address,
    String? notes,
  }) async {
    final res = await _api.post('/service-orders', data: {
      'service_id': serviceId,
      'schedule_at': scheduleAt,
      'address': address,
      if (notes != null) 'notes': notes,
    });
    return ServiceOrderModel.fromJson(res.data['data']);
  }

  /// GET /service-orders
  Future<List<ServiceOrderModel>> getMyBookings() async {
    final res = await _api.get('/service-orders');
    final data = res.data['data'];
    final items = data is Map ? (data['data'] ?? []) : (data ?? []);
    return (items as List).map((e) => ServiceOrderModel.fromJson(e)).toList();
  }

  /// GET /service-orders/{id}
  Future<ServiceOrderModel> getBookingDetail(int id) async {
    final res = await _api.get('/service-orders/$id');
    return ServiceOrderModel.fromJson(res.data['data']);
  }
}
