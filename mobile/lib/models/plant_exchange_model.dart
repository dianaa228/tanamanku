class PlantExchangeModel {
  final int id;
  final int listingId;
  final int offererId;
  final String? message;
  final String status; // pending, accepted, rejected
  final DateTime? respondedAt;
  final DateTime? createdAt;

  PlantExchangeModel({
    required this.id,
    required this.listingId,
    required this.offererId,
    this.message,
    this.status = 'pending',
    this.respondedAt,
    this.createdAt,
  });

  factory PlantExchangeModel.fromJson(Map<String, dynamic> json) {
    return PlantExchangeModel(
      id: json['id'] ?? 0,
      listingId: json['listing_id'] ?? 0,
      offererId: json['offerer_id'] ?? 0,
      message: json['message'],
      status: json['status'] ?? 'pending',
      respondedAt: json['responded_at'] != null ? DateTime.tryParse(json['responded_at']) : null,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
