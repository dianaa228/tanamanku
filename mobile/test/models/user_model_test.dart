import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/user_model.dart';

void main() {
  group('UserModel', () {
    test('fromJson parses user data correctly', () {
      final json = {
        'id': 1,
        'name': 'Budi Santoso',
        'email': 'budi@example.com',
        'phone': '08123456789',
        'role': 'customer',
        'avatar': 'https://example.com/avatar.jpg',
        'is_active': true,
        'member_since': '2026-01-15',
        'token': 'abc123',
      };

      final user = UserModel.fromJson(json);

      expect(user.id, 1);
      expect(user.name, 'Budi Santoso');
      expect(user.email, 'budi@example.com');
      expect(user.phone, '08123456789');
      expect(user.role, 'customer');
      expect(user.avatar, 'https://example.com/avatar.jpg');
      expect(user.isActive, true);
      expect(user.memberSince, '2026-01-15');
      expect(user.token, 'abc123');
    });

    test('fromJson handles missing fields with defaults', () {
      final json = <String, dynamic>{
        'id': 2,
        'name': 'Andi',
        'email': 'andi@example.com',
      };

      final user = UserModel.fromJson(json);

      expect(user.id, 2);
      expect(user.name, 'Andi');
      expect(user.email, 'andi@example.com');
      expect(user.phone, isNull);
      expect(user.role, 'customer');
      expect(user.avatar, isNull);
      expect(user.isActive, true);
      expect(user.token, isNull);
    });

    test('fromJson parses address from nested addresses array', () {
      final json = {
        'id': 1,
        'name': 'Budi',
        'email': 'budi@example.com',
        'addresses': [
          {
            'label': 'Rumah',
            'recipient': 'Budi',
            'phone': '08123456789',
            'province': 'Jawa Barat',
            'city': 'Bandung',
            'district': 'Coblong',
            'street': 'Jl. Dago No. 1',
            'postal_code': '40135',
            'is_default': true,
          }
        ],
      };

      final user = UserModel.fromJson(json);

      expect(user.address, isNotNull);
      expect(user.address!.label, 'Rumah');
      expect(user.address!.city, 'Bandung');
      expect(user.address!.isDefault, true);
    });

    test('toJson returns correct map', () {
      final user = UserModel(
        id: 1,
        name: 'Budi',
        email: 'budi@example.com',
        role: 'seller',
      );

      final json = user.toJson();

      expect(json['id'], 1);
      expect(json['name'], 'Budi');
      expect(json['email'], 'budi@example.com');
      expect(json['role'], 'seller');
      expect(json['is_active'], true);
    });

    test('isAdmin returns true for admin role', () {
      final admin = UserModel(id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin');
      expect(admin.isAdmin, true);
      expect(admin.isSeller, false);
    });

    test('isSeller returns true for seller role', () {
      final seller = UserModel(id: 1, name: 'Seller', email: 'seller@example.com', role: 'seller');
      expect(seller.isSeller, true);
      expect(seller.isAdmin, false);
    });

    test('customer is neither admin nor seller', () {
      final customer = UserModel(id: 1, name: 'Customer', email: 'cust@example.com', role: 'customer');
      expect(customer.isAdmin, false);
      expect(customer.isSeller, false);
    });

    test('fromJson parses stats', () {
      final json = {
        'id': 1,
        'name': 'Budi',
        'email': 'budi@example.com',
        'stats': {
          'total_orders': 5,
          'total_spent': 500000,
        },
      };

      final user = UserModel.fromJson(json);
      expect(user.stats, isNotNull);
      expect(user.stats!['total_orders'], 5);
      expect(user.stats!['total_spent'], 500000);
    });
  });
}
