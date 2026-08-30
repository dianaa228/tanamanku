class ServiceOrderModel {
  final int id;
  final int serviceId;
  final int customerId;
  final DateTime? scheduleAt;
  final Map<String, dynamic>? addressSnapshot;
  final String status; // pending, confirmed, in_progress, completed, cancelled
  final double total;
  final String? note;
  final DateTime? createdAt;

  ServiceOrderModel({
    required this.id,
    required this.serviceId,
    required this.customerId,
    this.scheduleAt,
    this.addressSnapshot,
    this.status = 'pending',
    this.total = 0,
    this.note,
    this.createdAt,
  });

  factory ServiceOrderModel.fromJson(Map<String, dynamic> json) {
    return ServiceOrderModel(
      id: json['id'] ?? 0,
      serviceId: json['service_id'] ?? 0,
      customerId: json['customer_id'] ?? 0,
      scheduleAt: json['schedule_at'] != null ? DateTime.tryParse(json['schedule_at']) : null,
      addressSnapshot: json['address_snapshot'],
      status: json['status'] ?? 'pending',
      total: (json['total'] ?? 0).toDouble(),
      note: json['note'],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
