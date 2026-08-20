import 'plant_species_model.dart';

class UserPlantModel {
  final int id;
  final int userId;
  final int? plantSpeciesId;
  final String nickname;
  final String? location;
  final String? pot;
  final String? photo;
  final DateTime? plantedAt;
  final String status;
  final double? heightCm;
  final PlantSpeciesModel? species;
  final List<PlantReminderModel> reminders;
  final List<PlantGrowthLogModel> growthLogs;
  final List<PlantCareLogModel> careLogs;

  UserPlantModel({
    required this.id,
    required this.userId,
    this.plantSpeciesId,
    required this.nickname,
    this.location,
    this.pot,
    this.photo,
    this.plantedAt,
    this.status = 'sehat',
    this.heightCm,
    this.species,
    this.reminders = const [],
    this.growthLogs = const [],
    this.careLogs = const [],
  });

  factory UserPlantModel.fromJson(Map<String, dynamic> json) {
    return UserPlantModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      plantSpeciesId: json['plant_species_id'],
      nickname: json['nickname'] ?? '',
      location: json['location'],
      pot: json['pot'],
      photo: json['photo'],
      plantedAt: json['planted_at'] != null ? DateTime.tryParse(json['planted_at']) : null,
      status: json['status'] ?? 'sehat',
      heightCm: json['height_cm']?.toDouble(),
      species: json['species'] != null ? PlantSpeciesModel.fromJson(json['species']) : null,
      reminders: (json['reminders'] as List<dynamic>?)
          ?.map((e) => PlantReminderModel.fromJson(e))
          .toList() ?? [],
      growthLogs: (json['growth_logs'] as List<dynamic>?)
          ?.map((e) => PlantGrowthLogModel.fromJson(e))
          .toList() ?? [],
      careLogs: (json['care_logs'] as List<dynamic>?)
          ?.map((e) => PlantCareLogModel.fromJson(e))
          .toList() ?? [],
    );
  }
}

class PlantReminderModel {
  final int id;
  final int userPlantId;
  final String type;
  final int frequencyDays;
  final DateTime? nextDueAt;
  final DateTime? lastDoneAt;
  final bool isActive;

  PlantReminderModel({
    required this.id,
    required this.userPlantId,
    required this.type,
    this.frequencyDays = 7,
    this.nextDueAt,
    this.lastDoneAt,
    this.isActive = true,
  });

  factory PlantReminderModel.fromJson(Map<String, dynamic> json) {
    return PlantReminderModel(
      id: json['id'] ?? 0,
      userPlantId: json['user_plant_id'] ?? 0,
      type: json['type'] ?? 'siram',
      frequencyDays: json['frequency_days'] ?? 7,
      nextDueAt: json['next_due_at'] != null ? DateTime.tryParse(json['next_due_at']) : null,
      lastDoneAt: json['last_done_at'] != null ? DateTime.tryParse(json['last_done_at']) : null,
      isActive: json['is_active'] ?? true,
    );
  }

  int? get daysUntilDue {
    if (nextDueAt == null) return null;
    return nextDueAt!.difference(DateTime.now()).inDays;
  }
}

class PlantGrowthLogModel {
  final int id;
  final double? heightCm;
  final int? leavesCount;
  final String? note;
  final DateTime? loggedAt;

  PlantGrowthLogModel({
    required this.id,
    this.heightCm,
    this.leavesCount,
    this.note,
    this.loggedAt,
  });

  factory PlantGrowthLogModel.fromJson(Map<String, dynamic> json) {
    return PlantGrowthLogModel(
      id: json['id'] ?? 0,
      heightCm: json['height_cm']?.toDouble(),
      leavesCount: json['leaves_count'],
      note: json['note'],
      loggedAt: json['logged_at'] != null ? DateTime.tryParse(json['logged_at']) : null,
    );
  }
}

class PlantCareLogModel {
  final int id;
  final String type;
  final String? note;
  final DateTime? doneAt;

  PlantCareLogModel({required this.id, required this.type, this.note, this.doneAt});

  factory PlantCareLogModel.fromJson(Map<String, dynamic> json) {
    return PlantCareLogModel(
      id: json['id'] ?? 0,
      type: json['type'] ?? '',
      note: json['note'],
      doneAt: json['done_at'] != null ? DateTime.tryParse(json['done_at']) : null,
    );
  }
}
