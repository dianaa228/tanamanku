import '../core/network/api_client.dart';

class AdminService {
  final _api = ApiClient();

  Future<Map<String, dynamic>> getDashboard() async {
    final res = await _api.get('/admin/dashboard');
    return res.data;
  }

  Future<List<dynamic>> getUsers() async {
    final res = await _api.get('/admin/users');
    return res.data['data'] ?? [];
  }

  Future<void> updateUserRole(int userId, String role) async {
    await _api.put('/admin/users/$userId/role', data: {'role': role});
  }

  Future<void> toggleUserActive(int userId) async {
    await _api.post('/admin/users/$userId/toggle');
  }

  Future<List<dynamic>> getStores() async {
    final res = await _api.get('/admin/stores');
    return res.data['data'] ?? [];
  }

  Future<void> verifyStore(int storeId) async {
    await _api.post('/admin/stores/$storeId/verify');
  }

  Future<List<dynamic>> getCategories() async {
    final res = await _api.get('/categories');
    return res.data['data'] ?? [];
  }

  Future<void> createCategory(Map<String, dynamic> data) async {
    await _api.post('/admin/categories', data: data);
  }

  Future<void> updateCategory(int id, Map<String, dynamic> data) async {
    await _api.put('/admin/categories/$id', data: data);
  }

  Future<void> deleteCategory(int id) async {
    await _api.delete('/admin/categories/$id');
  }

  Future<List<dynamic>> getOrders() async {
    final res = await _api.get('/admin/reports');
    return res.data['data'] ?? [];
  }

  Future<List<dynamic>> getReports() async {
    final res = await _api.get('/admin/community/reports');
    return res.data['data'] ?? [];
  }

  Future<void> resolveReport(int reportId) async {
    await _api.post('/admin/community/reports/$reportId/resolve');
  }

  Future<Map<String, dynamic>> getAnalytics() async {
    final res = await _api.get('/admin/analytics');
    return res.data;
  }
}
