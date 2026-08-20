class AddressModel {
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
}
