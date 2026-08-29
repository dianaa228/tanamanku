import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/core/constants/app_constants.dart';

void main() {
  group('AppConstants', () {
    test('role constants are correct', () {
      expect(AppConstants.roleCustomer, 'customer');
      expect(AppConstants.roleSeller, 'seller');
      expect(AppConstants.roleAdmin, 'admin');
    });

    test('order status constants are correct', () {
      expect(AppConstants.orderPending, 'pending');
      expect(AppConstants.orderPaid, 'paid');
      expect(AppConstants.orderProcessing, 'processing');
      expect(AppConstants.orderShipped, 'shipped');
      expect(AppConstants.orderDelivered, 'delivered');
      expect(AppConstants.orderCompleted, 'completed');
      expect(AppConstants.orderCancelled, 'cancelled');
    });

    test('payment status constants are correct', () {
      expect(AppConstants.paymentPending, 'pending');
      expect(AppConstants.paymentPaid, 'paid');
    });

    test('care types map has correct entries', () {
      expect(AppConstants.careTypes.length, 5);
      expect(AppConstants.careTypes['siram'], 'Penyiraman');
      expect(AppConstants.careTypes['pupuk'], 'Pemupukan');
      expect(AppConstants.careTypes['repot'], 'Repotting');
      expect(AppConstants.careTypes['cek-hama'], 'Cek Hama');
      expect(AppConstants.careTypes['potong'], 'Pemangkasan');
    });

    test('plant status constants are correct', () {
      expect(AppConstants.plantHealthy, 'sehat');
      expect(AppConstants.plantNeedsWater, 'perlu-air');
      expect(AppConstants.plantNeedsAttention, 'perhatian');
    });

    test('care levels map has correct entries', () {
      expect(AppConstants.careLevels.length, 3);
      expect(AppConstants.careLevels['mudah'], 'Mudah');
      expect(AppConstants.careLevels['sedang'], 'Sedang');
      expect(AppConstants.careLevels['sulit'], 'Sulit');
    });
  });
}
