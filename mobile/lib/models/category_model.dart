class CategoryModel {
  final int id;
  final String name;
  final String slug;
  final String? icon;
  final int productsCount;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
    this.productsCount = 0,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      icon: json['icon'],
      productsCount: json['products_count'] ?? 0,
    );
  }
}
