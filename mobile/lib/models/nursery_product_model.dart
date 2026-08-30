class NurseryProductModel {
  final int id;
  final int nurseryId;
  final String name;
  final int price;
  final int stock;
  final String? category;
  final String? image;
  final bool isActive;
  final DateTime? createdAt;

  NurseryProductModel({
    required this.id,
    required this.nurseryId,
    required this.name,
    this.price = 0,
    this.stock = 0,
    this.category,
    this.image,
    this.isActive = true,
    this.createdAt,
  });

  factory NurseryProductModel.fromJson(Map<String, dynamic> json) {
    return NurseryProductModel(
      id: json['id'] ?? 0,
      nurseryId: json['nursery_id'] ?? 0,
      name: json['name'] ?? '',
      price: json['price'] ?? 0,
      stock: json['stock'] ?? 0,
      category: json['category'],
      image: json['image'],
      isActive: json['is_active'] ?? true,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
