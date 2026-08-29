import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/product_model.dart';

void main() {
  group('ProductModel', () {
    test('fromJson parses product data correctly', () {
      final json = {
        'id': 1,
        'name': 'Monstera Deliciosa',
        'slug': 'monstera-deliciosa',
        'description': 'Tanaman hias populer',
        'price': 145000,
        'stock': 25,
        'care_level': 'mudah',
        'is_active': true,
        'rating_avg': 4.5,
        'sold_count': 120,
        'store': {
          'id': 1,
          'name': 'Green Garden',
          'slug': 'green-garden',
        },
        'category': {
          'id': 1,
          'name': 'Tanaman Hias',
          'slug': 'tanaman-hias',
        },
        'images': [
          {
            'id': 1,
            'path': 'https://example.com/monstera.jpg',
            'sort_order': 0,
            'is_primary': true,
          }
        ],
        'variants': [
          {
            'id': 1,
            'name': '20cm',
            'price_adjustment': 0,
            'stock': 15,
          },
          {
            'id': 2,
            'name': '30cm',
            'price_adjustment': 50000,
            'stock': 10,
          }
        ],
      };

      final product = ProductModel.fromJson(json);

      expect(product.id, 1);
      expect(product.name, 'Monstera Deliciosa');
      expect(product.slug, 'monstera-deliciosa');
      expect(product.description, 'Tanaman hias populer');
      expect(product.price, 145000);
      expect(product.stock, 25);
      expect(product.careLevel, 'mudah');
      expect(product.isActive, true);
      expect(product.ratingAvg, 4.5);
      expect(product.soldCount, 120);
      expect(product.store, isNotNull);
      expect(product.store!.name, 'Green Garden');
      expect(product.category, isNotNull);
      expect(product.category!.name, 'Tanaman Hias');
      expect(product.images.length, 1);
      expect(product.variants.length, 2);
      expect(product.variants[1].priceAdjustment, 50000);
    });

    test('fromJson handles missing fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'name': 'Test',
        'slug': 'test',
      };

      final product = ProductModel.fromJson(json);

      expect(product.price, 0);
      expect(product.stock, 0);
      expect(product.careLevel, 'mudah');
      expect(product.images, isEmpty);
      expect(product.variants, isEmpty);
      expect(product.ratingAvg, 0);
      expect(product.soldCount, 0);
    });

    test('imageUrl returns first image path', () {
      final product = ProductModel(
        id: 1,
        name: 'Test',
        slug: 'test',
        images: [
          ProductImage(id: 1, path: 'https://example.com/img1.jpg'),
          ProductImage(id: 2, path: 'https://example.com/img2.jpg'),
        ],
      );

      expect(product.imageUrl, 'https://example.com/img1.jpg');
    });

    test('imageUrl returns empty string when no images', () {
      final product = ProductModel(
        id: 1,
        name: 'Test',
        slug: 'test',
        images: [],
      );

      expect(product.imageUrl, '');
    });
  });

  group('StoreInfo', () {
    test('fromJson parses correctly', () {
      final store = StoreInfo.fromJson({'id': 1, 'name': 'Green Garden', 'slug': 'green-garden'});
      expect(store.id, 1);
      expect(store.name, 'Green Garden');
      expect(store.slug, 'green-garden');
    });

    test('fromJson handles missing slug', () {
      final store = StoreInfo.fromJson({'id': 1, 'name': 'Store'});
      expect(store.slug, isNull);
    });
  });

  group('ProductImage', () {
    test('fromJson parses correctly', () {
      final img = ProductImage.fromJson({
        'id': 1,
        'path': 'https://example.com/img.jpg',
        'sort_order': 2,
        'is_primary': true,
      });
      expect(img.id, 1);
      expect(img.path, 'https://example.com/img.jpg');
      expect(img.sortOrder, 2);
      expect(img.isPrimary, true);
    });

    test('fromJson handles defaults', () {
      final img = ProductImage.fromJson({'id': 1, 'path': ''});
      expect(img.sortOrder, 0);
      expect(img.isPrimary, false);
    });
  });

  group('ProductVariant', () {
    test('fromJson parses correctly', () {
      final variant = ProductVariant.fromJson({
        'id': 1,
        'name': 'Large',
        'price_adjustment': 50000,
        'stock': 10,
      });
      expect(variant.id, 1);
      expect(variant.name, 'Large');
      expect(variant.priceAdjustment, 50000);
      expect(variant.stock, 10);
    });

    test('fromJson handles defaults', () {
      final variant = ProductVariant.fromJson({'id': 1, 'name': ''});
      expect(variant.priceAdjustment, 0);
      expect(variant.stock, 0);
    });
  });
}
