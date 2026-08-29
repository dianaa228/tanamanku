import 'package:flutter/material.dart';
import '../../services/notification_service.dart';

class NotificationProvider extends ChangeNotifier {
  final _service = NotificationService();

  List<dynamic> notifications = [];
  bool loading = false;
  String? error;

  int get unreadCount => notifications.where((n) => n['read_at'] == null).length;

  Future<void> loadNotifications() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      notifications = await _service.getNotifications();
    } catch (e) {
      error = 'Gagal memuat notifikasi';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> markAsRead(int id) async {
    try {
      await _service.markAsRead(id);
      await loadNotifications();
    } catch (e) {
      // silent
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _service.markAllAsRead();
      await loadNotifications();
    } catch (e) {
      // silent
    }
  }
}
