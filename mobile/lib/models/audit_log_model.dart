class AuditLogModel {
  final int id;
  final int userId;
  final String action;
  final String auditableType;
  final int auditableId;
  final Map<String, dynamic>? oldValues;
  final Map<String, dynamic>? newValues;
  final String? ipAddress;
  final String? userAgent;
  final String? description;
  final DateTime? createdAt;

  AuditLogModel({
    required this.id,
    required this.userId,
    required this.action,
    required this.auditableType,
    required this.auditableId,
    this.oldValues,
    this.newValues,
    this.ipAddress,
    this.userAgent,
    this.description,
    this.createdAt,
  });

  factory AuditLogModel.fromJson(Map<String, dynamic> json) {
    return AuditLogModel(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      action: json['action'] ?? '',
      auditableType: json['auditable_type'] ?? '',
      auditableId: json['auditable_id'] ?? 0,
      oldValues: json['old_values'],
      newValues: json['new_values'],
      ipAddress: json['ip_address'],
      userAgent: json['user_agent'],
      description: json['description'],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
