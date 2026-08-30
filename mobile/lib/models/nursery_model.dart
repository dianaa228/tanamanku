class NurseryModel {
  final int id;
  final int ownerId;
  final String name;
  final String slug;
  final String? description;
  final String address;
  final String city;
  final String province;
  final String phone;
  final String? email;
  final String? hours;
  final bool isOpen;
  final double ratingAvg;
  final int reviewsCount;
  final int productsCount;
  final List<String> images;
  final List<String> categories;
  final int? foundedYear;
  final DateTime? createdAt;

  NurseryModel({
    required this.id,
    required this.ownerId,
    required this.name,
    required this.slug,
    this.description,
    required this.address,
    required this.city,
    required this.province,
    required this.phone,
    this.email,
    this.hours,
    this.isOpen = true,
    this.ratingAvg = 0,
    this.reviewsCount = 0,
    this.productsCount = 0,
    this.images = const [],
    this.categories = const [],
    this.foundedYear,
    this.createdAt,
  });

  factory NurseryModel.fromJson(Map<String, dynamic> json) {
    return NurseryModel(
      id: json['id'] ?? 0,
      ownerId: json['owner_id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      province: json['province'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'],
      hours: json['hours'],
      isOpen: json['is_open'] ?? true,
      ratingAvg: (json['rating_avg'] ?? 0).toDouble(),
      reviewsCount: json['reviews_count'] ?? 0,
      productsCount: json['products_count'] ?? 0,
      images: (json['images'] as List<dynamic>?)?.cast<String>() ?? [],
      categories: (json['categories'] as List<dynamic>?)?.cast<String>() ?? [],
      foundedYear: json['founded_year'],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
