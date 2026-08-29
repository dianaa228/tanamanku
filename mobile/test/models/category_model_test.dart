import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/category_model.dart';

void main() {
  group('CategoryModel', () {
    test('fromJson parses category correctly', () {
      final json = {
        'id': 1,
        'name': 'Tanaman Hias',
        'slug': 'tanaman-hias',
        'icon': '🌿',
        'products_count': 45,
      };

      final category = CategoryModel.fromJson(json);

      expect(category.id, 1);
      expect(category.name, 'Tanaman Hias');
      expect(category.slug, 'tanaman-hias');
      expect(category.icon, '🌿');
      expect(category.productsCount, 45);
    });

    test('fromJson handles missing fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'name': 'Test',
        'slug': 'test',
      };

      final category = CategoryModel.fromJson(json);

      expect(category.icon, isNull);
      expect(category.productsCount, 0);
    });
  });
}
