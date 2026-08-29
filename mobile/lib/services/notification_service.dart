import '../core/network/api_client.dart';

class NotificationService {
  final _api = ApiClient();

  Future<List<dynamic>> getNotifications() async {
    final res = await _api.get('/notifications');
    return res.data['data'] ?? [];
  }

  Future<void> markAsRead(int notificationId) async {
    await _api.post('/notifications/$notificationId/read');
  }

  Future<void> markAllAsRead() async {
    await _api.post('/notifications/read-all');
  }
}
