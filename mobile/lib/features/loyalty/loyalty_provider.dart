import 'package:flutter/material.dart';
import '../../services/loyalty_service.dart';

/// Provider loyalty — mengelola profil poin, tier, reward, dan riwayat transaksi.
class LoyaltyProvider extends ChangeNotifier {
  final _service = LoyaltyService();

  LoyaltyProfileModel? _profile;
  List<Map<String, dynamic>> _tiers = [];
  List<LoyaltyRewardModel> _rewards = [];
  List<LoyaltyTransactionModel> _history = [];

  bool _loading = false;
  String? _error;

  LoyaltyProfileModel? get profile => _profile;
  List<Map<String, dynamic>> get tiers => _tiers;
  List<LoyaltyRewardModel> get rewards => _rewards;
  List<LoyaltyTransactionModel> get history => _history;
  bool get loading => _loading;
  String? get error => _error;
  int get points => _profile?.points ?? 0;
  String get tier => _profile?.tier ?? 'bronze';

  /// Muat data awal (profile + tiers).
  Future<void> loadProfile() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _service.getProfile(),
        _service.getTiers(),
      ]);
      _profile = results[0] as LoyaltyProfileModel;
      _tiers = results[1] as List<Map<String, dynamic>>;
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat daftar reward yang bisa ditukar.
  Future<void> loadRewards({String? type}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _rewards = await _service.getRewards(type: type);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Tukar reward.
  Future<bool> redeemReward(int rewardId) async {
    try {
      await _service.redeemReward(rewardId);
      // Refresh profile to update points
      await loadProfile();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Muat riwayat transaksi.
  Future<void> loadHistory({String? type}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _history = await _service.getHistory(type: type);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
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
