class FavoriteModel {
  final int id;
  final int userId;
  final int productId;

  FavoriteModel({
    required this.id,
    required this.userId,
    required this.productId,
  });

  factory FavoriteModel.fromJson(Map<String, dynamic> json) {
    return FavoriteModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      productId: json['product_id'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'user_id': userId,
    'product_id': productId,
  };
}
