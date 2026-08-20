/// Konstanta global aplikasi Tanamanku.
class AppConstants {
  AppConstants._();

  // User roles
  static const String roleCustomer = 'customer';
  static const String roleSeller = 'seller';
  static const String roleAdmin = 'admin';

  // Order statuses
  static const String orderPending = 'pending';
  static const String orderPaid = 'paid';
  static const String orderProcessing = 'processing';
  static const String orderShipped = 'shipped';
  static const String orderDelivered = 'delivered';
  static const String orderCompleted = 'completed';
  static const String orderCancelled = 'cancelled';

  // Payment statuses
  static const String paymentPending = 'pending';
  static const String paymentPaid = 'paid';

  // Care types
  static const Map<String, String> careTypes = {
    'siram': 'Penyiraman',
    'pupuk': 'Pemupukan',
    'repot': 'Repotting',
    'cek-hama': 'Cek Hama',
    'potong': 'Pemangkasan',
  };

  // Plant statuses
  static const String plantHealthy = 'sehat';
  static const String plantNeedsWater = 'perlu-air';
  static const String plantNeedsAttention = 'perhatian';

  // Care level
  static const Map<String, String> careLevels = {
    'mudah': 'Mudah',
    'sedang': 'Sedang',
    'sulit': 'Sulit',
  };
}
