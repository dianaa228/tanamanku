import '../core/network/api_client.dart';
import '../models/address_model.dart';

/// Service alamat — mengonsumsi /api/v1/users/me/addresses.
class AddressService {
  final _api = ApiClient();

  /// GET /users/me/addresses
  Future<List<AddressModel>> list() async {
    final res = await _api.get('/users/me/addresses');
    final data = res.data['data'];
    if (data is List) {
      return data.map((a) => AddressModel.fromJson(a as Map<String, dynamic>)).toList();
    }
    return [];
  }

  /// POST /users/me/addresses
  Future<AddressModel> create(AddressModel address) async {
    final res = await _api.post('/users/me/addresses', data: address.toJson());
    return AddressModel.fromJson(res.data['data']);
  }

  /// PUT /users/me/addresses/{id}
  Future<AddressModel> update(AddressModel address) async {
    if (address.id == null) throw Exception('Alamat belum memiliki ID');
    final res = await _api.put('/users/me/addresses/${address.id}', data: address.toJson());
    return AddressModel.fromJson(res.data['data']);
  }
}
