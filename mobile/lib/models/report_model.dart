class ReportModel {
  final int id;
  final String reportableType;
  final int reportableId;
  final int reporterId;
  final String reason;
  final String status; // open, reviewed, resolved, dismissed
  final DateTime? createdAt;

  ReportModel({
    required this.id,
    required this.reportableType,
    required this.reportableId,
    required this.reporterId,
    required this.reason,
    this.status = 'open',
    this.createdAt,
  });

  factory ReportModel.fromJson(Map<String, dynamic> json) {
    return ReportModel(
      id: json['id'] ?? 0,
      reportableType: json['reportable_type'] ?? '',
      reportableId: json['reportable_id'] ?? 0,
      reporterId: json['reporter_id'] ?? 0,
      reason: json['reason'] ?? '',
      status: json['status'] ?? 'open',
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
