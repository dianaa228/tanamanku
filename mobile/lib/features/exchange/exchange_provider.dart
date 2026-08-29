import 'package:flutter/material.dart';
import '../../services/exchange_service.dart';

/// Provider plant exchange — mengelola listing, tawaran, dan pertukaran.
class ExchangeProvider extends ChangeNotifier {
  final _service = ExchangeService();

  List<PlantListingModel> _listings = [];
  List<PlantListingModel> _myListings = [];
  List<PlantExchangeModel> _myExchanges = [];
  PlantListingModel? _currentListing;
  String? _filterType;

  bool _loading = false;
  String? _error;

  List<PlantListingModel> get listings => _listings;
  List<PlantListingModel> get myListings => _myListings;
  List<PlantExchangeModel> get myExchanges => _myExchanges;
  PlantListingModel? get currentListing => _currentListing;
  String? get filterType => _filterType;
  bool get loading => _loading;
  String? get error => _error;

  /// Muat daftar listing.
  Future<void> loadListings({String? type}) async {
    _loading = true;
    _error = null;
    if (type != null) _filterType = type;
    notifyListeners();

    try {
      _listings = await _service.getListings(type: _filterType);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Muat detail listing.
  Future<void> loadListing(int id) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _currentListing = await _service.getListing(id);
      _loading = false;
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      _loading = false;
      notifyListeners();
    }
  }

  /// Buat listing baru.
  Future<bool> createListing({
    required String title,
    String? description,
    double? price,
    required String type,
    int? plantSpeciesId,
  }) async {
    try {
      final listing = await _service.createListing(
        title: title,
        description: description,
        price: price,
        type: type,
        plantSpeciesId: plantSpeciesId,
      );
      _listings.insert(0, listing);
      _myListings.insert(0, listing);
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Kirim tawaran.
  Future<bool> makeOffer(int listingId, {String? message}) async {
    try {
      await _service.makeOffer(listingId, message: message);
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Muat listing milik saya.
  Future<void> loadMyListings() async {
    try {
      _myListings = await _service.getMyListings();
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
    }
  }

  /// Muat exchange milik saya.
  Future<void> loadMyExchanges() async {
    try {
      _myExchanges = await _service.getMyExchanges();
      notifyListeners();
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
    }
  }

  /// Balas exchange (accept/reject).
  Future<bool> respondToExchange(int exchangeId, String status) async {
    try {
      await _service.respondToExchange(exchangeId, status);
      await loadMyExchanges();
      return true;
    } catch (e) {
      _error = _extractError(e);
      notifyListeners();
      return false;
    }
  }

  /// Set filter tipe.
  void setFilterType(String? type) {
    _filterType = type;
    loadListings(type: type);
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
