class AddressModel {
  final int? id;
  final String label;
  final String recipient;
  final String phone;
  final String province;
  final String city;
  final String district;
  final String street;
  final String postalCode;
  final bool isDefault;

  AddressModel({
    this.id,
    required this.label,
    required this.recipient,
    required this.phone,
    required this.province,
    required this.city,
    required this.district,
    required this.street,
    required this.postalCode,
    this.isDefault = false,
  });

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      id: json['id'],
      label: json['label'] ?? '',
      recipient: json['recipient'] ?? '',
      phone: json['phone'] ?? '',
      province: json['province'] ?? '',
      city: json['city'] ?? '',
      district: json['district'] ?? '',
      street: json['street'] ?? '',
      postalCode: json['postal_code'] ?? json['postalCode'] ?? '',
      isDefault: json['is_default'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    if (id != null) 'id': id,
    'label': label,
    'recipient': recipient,
    'phone': phone,
    'province': province,
    'city': city,
    'district': district,
    'street': street,
    'postal_code': postalCode,
    'is_default': isDefault,
  };

  AddressModel copyWith({
    String? label,
    String? recipient,
    String? phone,
    String? province,
    String? city,
    String? district,
    String? street,
    String? postalCode,
    bool? isDefault,
  }) {
    return AddressModel(
      id: id,
      label: label ?? this.label,
      recipient: recipient ?? this.recipient,
      phone: phone ?? this.phone,
      province: province ?? this.province,
      city: city ?? this.city,
      district: district ?? this.district,
      street: street ?? this.street,
      postalCode: postalCode ?? this.postalCode,
      isDefault: isDefault ?? this.isDefault,
    );
  }
}
