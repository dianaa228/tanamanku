import 'package:flutter/material.dart';
import '../../services/subscription_service.dart';

class SubscriptionProvider extends ChangeNotifier {
  final _service = SubscriptionService();

  List<dynamic> plans = [];
  Map<String, dynamic>? currentPlan;
  List<dynamic> billingHistory = [];
  bool loading = false;
  String? error;

  Future<void> loadPlans() async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      plans = await _service.getPlans();
    } catch (e) {
      error = 'Gagal memuat paket langganan';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadCurrentPlan() async {
    try {
      currentPlan = await _service.getCurrentSubscription();
      notifyListeners();
    } catch (e) {
      // silent
    }
  }

  Future<bool> subscribe(String planId, String paymentMethod) async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      currentPlan = await _service.subscribe(planId, paymentMethod);
      await loadPlans();
      return true;
    } catch (e) {
      error = 'Gagal berlangganan';
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> cancel() async {
    loading = true;
    notifyListeners();
    try {
      await _service.cancelSubscription();
      await loadCurrentPlan();
    } catch (e) {
      error = 'Gagal membatalkan langganan';
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> loadBillingHistory() async {
    try {
      billingHistory = await _service.getBillingHistory();
      notifyListeners();
    } catch (e) {
      // silent
    }
  }
}
