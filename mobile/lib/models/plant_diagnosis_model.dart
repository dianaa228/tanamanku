class PlantDiagnosisModel {
  final int id;
  final int userPlantId;
  final List<String> symptoms;
  final String diagnosis;
  final String severity; // low, medium, high, critical
  final List<String> advice;
  final DateTime? createdAt;

  PlantDiagnosisModel({
    required this.id,
    required this.userPlantId,
    this.symptoms = const [],
    required this.diagnosis,
    required this.severity,
    this.advice = const [],
    this.createdAt,
  });

  factory PlantDiagnosisModel.fromJson(Map<String, dynamic> json) {
    return PlantDiagnosisModel(
      id: json['id'] ?? 0,
      userPlantId: json['user_plant_id'] ?? 0,
      symptoms: (json['symptoms'] as List<dynamic>?)?.cast<String>() ?? [],
      diagnosis: json['diagnosis'] ?? '',
      severity: json['severity'] ?? 'low',
      advice: (json['advice'] as List<dynamic>?)?.cast<String>() ?? [],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
