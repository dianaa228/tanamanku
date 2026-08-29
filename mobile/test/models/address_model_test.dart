import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/address_model.dart';

void main() {
  group('AddressModel', () {
    test('fromJson parses address correctly', () {
      final json = {
        'label': 'Rumah',
        'recipient': 'Budi Santoso',
        'phone': '08123456789',
        'province': 'Jawa Barat',
        'city': 'Bandung',
        'district': 'Coblong',
        'street': 'Jl. Dago No. 1',
        'postal_code': '40135',
        'is_default': true,
      };

      final address = AddressModel.fromJson(json);

      expect(address.label, 'Rumah');
      expect(address.recipient, 'Budi Santoso');
      expect(address.phone, '08123456789');
      expect(address.province, 'Jawa Barat');
      expect(address.city, 'Bandung');
      expect(address.district, 'Coblong');
      expect(address.street, 'Jl. Dago No. 1');
      expect(address.postalCode, '40135');
      expect(address.isDefault, true);
    });

    test('fromJson handles missing fields', () {
      final address = AddressModel.fromJson({});
      expect(address.label, '');
      expect(address.recipient, '');
      expect(address.isDefault, false);
    });

    test('toJson returns correct map', () {
      final address = AddressModel(
        label: 'Kantor',
        recipient: 'Budi',
        phone: '08123456789',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        district: 'Kebayoran',
        street: 'Jl. Sudirman',
        postalCode: '12190',
        isDefault: false,
      );

      final json = address.toJson();

      expect(json['label'], 'Kantor');
      expect(json['recipient'], 'Budi');
      expect(json['province'], 'DKI Jakarta');
      expect(json['city'], 'Jakarta Selatan');
      expect(json['is_default'], false);
    });
  });
}
