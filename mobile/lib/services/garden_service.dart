import '../core/network/api_client.dart';
import '../models/user_plant_model.dart';
import '../models/plant_species_model.dart';

/// Service My Garden & Smart Plant — mengonsumsi /api/v1/my-garden, /plant-finder, /plant-diagnosis.
class GardenService {
  final _api = ApiClient();

  // ── My Garden ─────────────────────────────────────────

  /// Ambil daftar tanaman pengguna: GET /my-garden
  Future<List<UserPlantModel>> getMyPlants() async {
    final res = await _api.get('/my-garden');
    final data = res.data['data'];
    final list = data is List ? data : [];
    return list.map((e) => UserPlantModel.fromJson(e)).toList();
  }

  /// Detail tanaman: GET /my-garden/{id}
  Future<UserPlantModel> getPlant(int id) async {
    final res = await _api.get('/my-garden/$id');
    return UserPlantModel.fromJson(res.data['data']);
  }

  /// Tambah tanaman: POST /my-garden
  Future<UserPlantModel> addPlant({
    required int plantSpeciesId,
    required String nickname,
    String? location,
    String? pot,
    int? waterFrequencyDays,
  }) async {
    final res = await _api.post('/my-garden', data: {
      'plant_species_id': plantSpeciesId,
      'nickname': nickname,
      if (location != null) 'location': location,
      if (pot != null) 'pot': pot,
      if (waterFrequencyDays != null) 'water_frequency_days': waterFrequencyDays,
    });
    return UserPlantModel.fromJson(res.data['data']);
  }

  /// Update tanaman: PUT /my-garden/{id}
  Future<UserPlantModel> updatePlant(int id, Map<String, dynamic> data) async {
    final res = await _api.put('/my-garden/$id', data: data);
    return UserPlantModel.fromJson(res.data['data']);
  }

  /// Hapus tanaman: DELETE /my-garden/{id}
  Future<void> deletePlant(int id) async {
    await _api.delete('/my-garden/$id');
  }

  /// Catat penyiraman: POST /my-garden/{id}/care (type=siram)
  Future<void> waterPlant(int plantId) async {
    await _api.post('/my-garden/$plantId/care', data: {'type': 'siram'});
  }

  /// Catat perawatan: POST /my-garden/{id}/care
  Future<void> addCareLog(int plantId, String type, {String? note}) async {
    await _api.post('/my-garden/$plantId/care', data: {
      'type': type,
      if (note != null) 'note': note,
    });
  }

  /// Tambah foto: POST /my-garden/{id}/photos
  Future<void> addPhoto(int plantId, String path, {String? note}) async {
    await _api.post('/my-garden/$plantId/photos', data: {
      'path': path,
      if (note != null) 'note': note,
    });
  }

  /// Ambil daftar foto: GET /my-garden/{id}/photos
  Future<List<Map<String, dynamic>>> getPhotos(int plantId) async {
    final res = await _api.get('/my-garden/$plantId/photos');
    final data = res.data['data'];
    final list = data is List ? data : [];
    return List<Map<String, dynamic>>.from(list);
  }

  /// Hapus foto: DELETE /my-garden/photos/{photoId}
  Future<void> deletePhoto(int photoId) async {
    await _api.delete('/my-garden/photos/$photoId');
  }

  /// Ambil riwayat pertumbuhan: GET /my-garden/{id}/growth-logs
  Future<List<Map<String, dynamic>>> getGrowthLogs(int plantId) async {
    final res = await _api.get('/my-garden/$plantId/growth-logs');
    final data = res.data['data'];
    final list = data is List ? data : [];
    return List<Map<String, dynamic>>.from(list);
  }

  /// Tambah log pertumbuhan: POST /my-garden/{id}/growth-logs
  Future<void> addGrowthLog(int plantId, {required double heightCm, int? leavesCount, String? note}) async {
    await _api.post('/my-garden/$plantId/growth-logs', data: {
      'height_cm': heightCm,
      if (leavesCount != null) 'leaves_count': leavesCount,
      if (note != null) 'note': note,
    });
  }

  // ── Reminders ─────────────────────────────────────────

  /// Ambil reminder: GET /my-garden/{id}/reminders
  Future<List<PlantReminderModel>> getReminders(int plantId) async {
    final res = await _api.get('/my-garden/$plantId/reminders');
    final data = res.data['data'];
    final list = data is List ? data : [];
    return list.map((e) => PlantReminderModel.fromJson(e)).toList();
  }

  /// Tambah reminder: POST /my-garden/{id}/reminders
  Future<PlantReminderModel> addReminder(int plantId, String type, int frequencyDays) async {
    final res = await _api.post('/my-garden/$plantId/reminders', data: {
      'type': type,
      'frequency_days': frequencyDays,
    });
    return PlantReminderModel.fromJson(res.data['data']);
  }

  /// Tandai selesai: POST /my-garden/reminders/{id}/done
  Future<void> markReminderDone(int reminderId) async {
    await _api.post('/my-garden/reminders/$reminderId/done');
  }

  // ── Reminders (by plantId) ─────────────────────────────

  /// Ambil reminder per tanaman: GET /my-garden/{id}/reminders (sudah ada di atas)

  // ── Plant Species ─────────────────────────────────────

  /// Ambil daftar spesies: GET /plant-species
  Future<List<PlantSpeciesModel>> getSpecies() async {
    final res = await _api.get('/plant-species');
    final data = res.data['data'];
    final list = data is List ? data : [];
    return list.map((e) => PlantSpeciesModel.fromJson(e)).toList();
  }

  // ── Plant Finder ──────────────────────────────────────

  /// Ambil pertanyaan: GET /plant-finder/questions
  Future<List<Map<String, dynamic>>> getFinderQuestions() async {
    final res = await _api.get('/plant-finder/questions');
    final data = res.data['data'];
    return data is List ? List<Map<String, dynamic>>.from(data) : [];
  }

  /// Rekomendasi: GET /plant-finder/recommend
  Future<List<PlantSpeciesModel>> getRecommendation(Map<String, String> answers) async {
    final res = await _api.get('/plant-finder/recommend', queryParameters: answers);
    final data = res.data['data'];
    final list = data is List ? data : [];
    return list.map((e) => PlantSpeciesModel.fromJson(e)).toList();
  }

  // ── Plant Diagnosis ───────────────────────────────────

  /// Diagnosis: POST /plant-diagnosis
  Future<Map<String, dynamic>> diagnose(int? plantId, List<String> symptoms) async {
    final res = await _api.post('/plant-diagnosis', data: {
      if (plantId != null) 'user_plant_id': plantId,
      'symptoms': symptoms,
    });
    return res.data['data'] ?? {};
  }
}
