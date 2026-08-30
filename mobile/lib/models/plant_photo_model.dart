class PlantPhotoModel {
  final int id;
  final int userPlantId;
  final String path;
  final String? note;
  final DateTime? takenAt;
  final DateTime? createdAt;

  PlantPhotoModel({
    required this.id,
    required this.userPlantId,
    required this.path,
    this.note,
    this.takenAt,
    this.createdAt,
  });

  factory PlantPhotoModel.fromJson(Map<String, dynamic> json) {
    return PlantPhotoModel(
      id: json['id'] ?? 0,
      userPlantId: json['user_plant_id'] ?? 0,
      path: json['path'] ?? '',
      note: json['note'],
      takenAt: json['taken_at'] != null ? DateTime.tryParse(json['taken_at']) : null,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
