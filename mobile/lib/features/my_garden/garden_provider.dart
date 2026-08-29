import 'package:flutter/material.dart';
import '../../models/user_plant_model.dart';
import '../../models/plant_species_model.dart';
import '../../services/garden_service.dart';

/// Provider My Garden — mengelola tanaman pengguna, reminder, plant finder & diagnosis.
class GardenProvider extends ChangeNotifier {
  final _service = GardenService();

  List<UserPlantModel> _plants = [];
  UserPlantModel? _currentPlant;
  List<PlantSpeciesModel> _recommendations = [];
  Map<String, dynamic>? _diagnosisResult;

  bool _loading = false;
  String? _error;

  List<UserPlantModel> get plants => _plants;
  UserPlantModel? get currentPlant => _currentPlant;
  List<PlantSpeciesModel> get recommendations => _recommendations;
  Map<String, dynamic>? get diagnosisResult => _diagnosisResult;
  bool get loading => _loading;
  String? get error => _error;

  /// Jumlah tanaman berdasarkan status.
  int countByStatus(String status) => _plants.where((p) => p.status == status).length;

  /// Semua reminder aktif dari semua tanaman.
  List<({UserPlantModel plant, PlantReminderModel reminder})> get activeReminders {
    final list = _plants
        .expand((p) => p.reminders.where((r) => r.isActive).map((r) => (plant: p, reminder: r)))
        .toList()
      ..sort((a, b) => (a.reminder.nextDueAt ?? DateTime.now()).compareTo(b.reminder.nextDueAt ?? DateTime.now()));
    return list;
  }

  /// Muat semua tanaman pengguna.
  Future<void> loadMyPlants() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _plants = await _service.getMyPlants();
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat detail tanaman.
  Future<void> loadPlant(int id) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _currentPlant = await _service.getPlant(id);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Tambah tanaman baru.
  Future<bool> addPlant({
    required int plantSpeciesId,
    required String nickname,
    String? location,
    String? pot,
    int? waterFrequencyDays,
  }) async {
    try {
      final plant = await _service.addPlant(
        plantSpeciesId: plantSpeciesId,
        nickname: nickname,
        location: location,
        pot: pot,
        waterFrequencyDays: waterFrequencyDays,
      );
      _plants.insert(0, plant);
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Update tanaman.
  Future<bool> updatePlant(int id, Map<String, dynamic> data) async {
    try {
      final updated = await _service.updatePlant(id, data);
      final index = _plants.indexWhere((p) => p.id == updated.id);
      if (index != -1) _plants[index] = updated;
      if (_currentPlant?.id == updated.id) _currentPlant = updated;
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Hapus tanaman.
  Future<bool> deletePlant(int id) async {
    try {
      await _service.deletePlant(id);
      _plants.removeWhere((p) => p.id == id);
      if (_currentPlant?.id == id) _currentPlant = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Catat penyiraman.
  Future<bool> waterPlant(int plantId) async {
    try {
      await _service.waterPlant(plantId);
      await loadMyPlants(); // refresh
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Tandai reminder selesai.
  Future<bool> markReminderDone(int reminderId) async {
    try {
      await _service.markReminderDone(reminderId);
      await loadMyPlants(); // refresh
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  // ── Plant Finder ──────────────────────────────────────

  /// Muat pertanyaan plant finder.
  Future<List<Map<String, dynamic>>> loadFinderQuestions() async {
    try {
      return await _service.getFinderQuestions();
    } catch (_) {
      return [];
    }
  }

  /// Dapatkan rekomendasi tanaman.
  Future<void> getRecommendation(Map<String, String> answers) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _recommendations = await _service.getRecommendation(answers);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  // ── Plant Diagnosis ───────────────────────────────────

  /// Diagnosis tanaman.
  Future<void> diagnose(int? plantId, List<String> symptoms) async {
    _loading = true;
    _error = null;
    _diagnosisResult = null;
    notifyListeners();

    try {
      _diagnosisResult = await _service.diagnose(plantId, symptoms);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Reset diagnosis result.
  void resetDiagnosis() {
    _diagnosisResult = null;
    notifyListeners();
  }

  String _extractError(dynamic e) {
    try {
      if (e is Exception) {
        final dynamic dioError = e;
        if (dioError.response?.data?['message'] != null) {
          return dioError.response!.data['message'] as String;
        }
      }
    } catch (_) {}
    return 'Terjadi kesalahan. Coba lagi.';
  }
}
