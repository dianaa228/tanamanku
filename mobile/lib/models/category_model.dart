class CategoryModel {
  final int id;
  final String name;
  final String slug;
  final String? icon;
  final int? parentId;
  final bool isActive;
  final int sortOrder;
  final int productsCount;

  CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
    this.parentId,
    this.isActive = true,
    this.sortOrder = 0,
    this.productsCount = 0,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      icon: json['icon'],
      parentId: json['parent_id'],
      isActive: json['is_active'] ?? true,
      sortOrder: json['sort_order'] ?? 0,
      productsCount: json['products_count'] ?? 0,
    );
  }
}
