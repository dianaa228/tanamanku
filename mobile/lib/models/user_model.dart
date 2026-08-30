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
  final List<AddressModel> addresses;
  final Map<String, dynamic>? stats;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.role = 'customer',
    this.avatar,
    this.isActive = true,
    this.memberSince,
    this.token,
    this.addresses = const [],
    this.stats,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    // Parse daftar alamat dari nested addresses atau direct address field
    List<AddressModel> addresses = [];
    if (json['addresses'] != null && (json['addresses'] as List).isNotEmpty) {
      addresses = (json['addresses'] as List)
          .map((a) => AddressModel.fromJson(a as Map<String, dynamic>))
          .toList();
    } else if (json['address'] != null) {
      addresses = [AddressModel.fromJson(json['address'])];
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
      addresses: addresses,
      stats: json['stats'],
    );
  }

  /// Konversi ke JSON untuk penyimpanan lokal.
  /// Token TIDAK disimpan di JSON untuk keamanan — token disimpan
  /// secara terpisah di secure storage via LocalStorage.saveToken().
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phone': phone,
    'role': role,
    'avatar': avatar,
    'is_active': isActive,
    'member_since': memberSince,
    'addresses': addresses.map((a) => a.toJson()).toList(),
    'stats': stats,
  };

  /// Konversi ke JSON lengkap (termasuk token) — HANYA untuk respons API,
  /// bukan untuk penyimpanan lokal.
  Map<String, dynamic> toFullJson() => {
    ...toJson(),
    if (token != null) 'token': token,
  };

  /// Alamat utama (default pertama yang dipakai pesanan).
  AddressModel? get address {
    if (addresses.isNotEmpty) {
      for (final a in addresses) {
        if (a.isDefault) return a;
      }
      return addresses.first;
    }
    return null;
  }

  bool get isAdmin => role == 'admin';
  bool get isSeller => role == 'seller';
}
