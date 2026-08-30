class ServiceModel {
  final int id;
  final int providerId;
  final String category;
  final String name;
  final String? description;
  final double pricePerVisit;
  final int duration;
  final String? serviceArea;
  final bool isActive;
  final DateTime? createdAt;

  ServiceModel({
    required this.id,
    required this.providerId,
    required this.category,
    required this.name,
    this.description,
    required this.pricePerVisit,
    this.duration = 60,
    this.serviceArea,
    this.isActive = true,
    this.createdAt,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] ?? 0,
      providerId: json['provider_id'] ?? 0,
      category: json['category'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      pricePerVisit: (json['price_per_visit'] ?? 0).toDouble(),
      duration: json['duration'] ?? 60,
      serviceArea: json['service_area'],
      isActive: json['is_active'] ?? true,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
