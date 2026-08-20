class PostModel {
  final int id;
  final int userId;
  final String content;
  final int likesCount;
  final int commentsCount;
  final DateTime? createdAt;
  final PostUserModel? user;
  final List<PostImageModel> images;
  final List<CommentModel> comments;
  final bool isLiked;

  PostModel({
    required this.id,
    required this.userId,
    required this.content,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.createdAt,
    this.user,
    this.images = const [],
    this.comments = const [],
    this.isLiked = false,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      content: json['content'] ?? '',
      likesCount: json['likes_count'] ?? 0,
      commentsCount: json['comments_count'] ?? 0,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      user: json['user'] != null ? PostUserModel.fromJson(json['user']) : null,
      images: (json['images'] as List<dynamic>?)
          ?.map((e) => PostImageModel.fromJson(e))
          .toList() ?? [],
      comments: (json['comments'] as List<dynamic>?)
          ?.map((e) => CommentModel.fromJson(e))
          .toList() ?? [],
    );
  }
}

class PostUserModel {
  final int id;
  final String name;
  final String? avatar;

  PostUserModel({required this.id, required this.name, this.avatar});

  factory PostUserModel.fromJson(Map<String, dynamic> json) {
    return PostUserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      avatar: json['avatar'],
    );
  }
}

class PostImageModel {
  final int id;
  final String path;
  final int sortOrder;

  PostImageModel({required this.id, required this.path, this.sortOrder = 0});

  factory PostImageModel.fromJson(Map<String, dynamic> json) {
    return PostImageModel(
      id: json['id'] ?? 0,
      path: json['path'] ?? '',
      sortOrder: json['sort_order'] ?? 0,
    );
  }
}

class CommentModel {
  final int id;
  final int postId;
  final int userId;
  final String content;
  final DateTime? createdAt;
  final PostUserModel? user;

  CommentModel({
    required this.id,
    required this.postId,
    required this.userId,
    required this.content,
    this.createdAt,
    this.user,
  });

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    return CommentModel(
      id: json['id'] ?? 0,
      postId: json['post_id'] ?? 0,
      userId: json['user_id'] ?? 0,
      content: json['content'] ?? '',
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      user: json['user'] != null ? PostUserModel.fromJson(json['user']) : null,
    );
  }
}
