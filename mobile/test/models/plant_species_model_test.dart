import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/plant_species_model.dart';

void main() {
  group('PlantSpeciesModel', () {
    test('fromJson parses species correctly', () {
      final json = {
        'id': 1,
        'name': 'Monstera Deliciosa',
        'slug': 'monstera-deliciosa',
        'scientific_name': 'Monstera deliciosa',
        'category': 'Aroid',
        'care_level': 'mudah',
        'light_requirement': 'Indirect light',
        'water_requirement': 'Sedang',
        'humidity': 'Tinggi',
        'temperature': '20-30°C',
        'growth_duration': 'Cepat',
        'description': 'Tanaman hias populer',
        'image': 'https://example.com/monstera.jpg',
      };

      final species = PlantSpeciesModel.fromJson(json);

      expect(species.id, 1);
      expect(species.name, 'Monstera Deliciosa');
      expect(species.slug, 'monstera-deliciosa');
      expect(species.scientificName, 'Monstera deliciosa');
      expect(species.category, 'Aroid');
      expect(species.careLevel, 'mudah');
      expect(species.lightRequirement, 'Indirect light');
      expect(species.waterRequirement, 'Sedang');
      expect(species.humidity, 'Tinggi');
      expect(species.temperature, '20-30°C');
      expect(species.growthDuration, 'Cepat');
      expect(species.description, 'Tanaman hias populer');
      expect(species.image, 'https://example.com/monstera.jpg');
    });

    test('fromJson handles missing optional fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'name': 'Test',
        'slug': 'test',
      };

      final species = PlantSpeciesModel.fromJson(json);

      expect(species.scientificName, isNull);
      expect(species.category, isNull);
      expect(species.careLevel, 'mudah');
      expect(species.lightRequirement, isNull);
      expect(species.image, isNull);
    });
  });
}
