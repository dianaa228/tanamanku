import 'address_model.dart';

class UserModel {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String role;
  final String? avatar;
  final bool isActive;
  final String? memberSince;
  final String? token;
  final AddressModel? address;
  final Map<String, dynamic>? stats;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.role = 'customer',
    this.avatar,
    this.isActive = true,
    this.memberSince,
    this.token,
    this.address,
    this.stats,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    // Parse address from nested addresses array or direct address field
    AddressModel? address;
    if (json['addresses'] != null && (json['addresses'] as List).isNotEmpty) {
      address = AddressModel.fromJson(json['addresses'][0]);
    } else if (json['address'] != null) {
      address = AddressModel.fromJson(json['address']);
    }

    return UserModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      role: json['role'] ?? 'customer',
      avatar: json['avatar'],
      isActive: json['is_active'] ?? true,
      memberSince: json['member_since'],
      token: json['token'],
      address: address,
      stats: json['stats'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phone': phone,
    'role': role,
    'avatar': avatar,
    'is_active': isActive,
    'member_since': memberSince,
    'token': token,
    'address': address?.toJson(),
    'stats': stats,
  };

  bool get isAdmin => role == 'admin';
  bool get isSeller => role == 'seller';
}
