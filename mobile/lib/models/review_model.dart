import 'user_model.dart';

class ReviewModel {
  final int id;
  final int orderItemId;
  final int userId;
  final int rating;
  final String? comment;
  final List<String> images;
  final DateTime? createdAt;
  final UserModel? user;

  ReviewModel({
    required this.id,
    required this.orderItemId,
    required this.userId,
    required this.rating,
    this.comment,
    this.images = const [],
    this.createdAt,
    this.user,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      id: json['id'] ?? 0,
      orderItemId: json['order_item_id'] ?? 0,
      userId: json['user_id'] ?? 0,
      rating: json['rating'] ?? 0,
      comment: json['comment'],
      images: (json['images'] as List<dynamic>?)?.cast<String>() ?? [],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      user: json['user'] != null ? UserModel.fromJson(json['user']) : null,
    );
  }
}
