import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/models/user_plant_model.dart';

void main() {
  group('UserPlantModel', () {
    test('fromJson parses plant correctly', () {
      final json = {
        'id': 1,
        'user_id': 10,
        'plant_species_id': 5,
        'nickname': 'MonsteraKu',
        'location': 'Ruang Tamu',
        'pot': 'Pot Keramik',
        'photo': 'https://example.com/plant.jpg',
        'planted_at': '2026-01-15',
        'status': 'sehat',
        'height_cm': 45.5,
        'species': {
          'id': 5,
          'name': 'Monstera Deliciosa',
          'slug': 'monstera-deliciosa',
        },
        'reminders': [
          {
            'id': 1,
            'user_plant_id': 1,
            'type': 'siram',
            'frequency_days': 3,
            'is_active': true,
          }
        ],
        'growth_logs': [
          {
            'id': 1,
            'height_cm': 45.5,
            'leaves_count': 12,
            'note': 'Tumbuh subur',
          }
        ],
        'care_logs': [
          {
            'id': 1,
            'type': 'siram',
            'note': 'Pagi hari',
          }
        ],
      };

      final plant = UserPlantModel.fromJson(json);

      expect(plant.id, 1);
      expect(plant.userId, 10);
      expect(plant.plantSpeciesId, 5);
      expect(plant.nickname, 'MonsteraKu');
      expect(plant.location, 'Ruang Tamu');
      expect(plant.pot, 'Pot Keramik');
      expect(plant.photo, 'https://example.com/plant.jpg');
      expect(plant.plantedAt, isNotNull);
      expect(plant.status, 'sehat');
      expect(plant.heightCm, 45.5);
      expect(plant.species, isNotNull);
      expect(plant.species!.name, 'Monstera Deliciosa');
      expect(plant.reminders.length, 1);
      expect(plant.growthLogs.length, 1);
      expect(plant.careLogs.length, 1);
    });

    test('fromJson handles missing fields', () {
      final json = <String, dynamic>{
        'id': 1,
        'user_id': 10,
        'nickname': 'Test',
      };

      final plant = UserPlantModel.fromJson(json);

      expect(plant.plantSpeciesId, isNull);
      expect(plant.location, isNull);
      expect(plant.species, isNull);
      expect(plant.reminders, isEmpty);
      expect(plant.growthLogs, isEmpty);
      expect(plant.careLogs, isEmpty);
    });
  });

  group('PlantReminderModel', () {
    test('fromJson parses reminder correctly', () {
      final json = {
        'id': 1,
        'user_plant_id': 10,
        'type': 'siram',
        'frequency_days': 3,
        'next_due_at': '2026-01-20T08:00:00.000000Z',
        'last_done_at': '2026-01-17T08:00:00.000000Z',
        'is_active': true,
      };

      final reminder = PlantReminderModel.fromJson(json);

      expect(reminder.id, 1);
      expect(reminder.userPlantId, 10);
      expect(reminder.type, 'siram');
      expect(reminder.frequencyDays, 3);
      expect(reminder.nextDueAt, isNotNull);
      expect(reminder.lastDoneAt, isNotNull);
      expect(reminder.isActive, true);
    });

    test('daysUntilDue returns correct value', () {
      final futureDate = DateTime.now().add(const Duration(days: 5, hours: 12));
      final reminder = PlantReminderModel(
        id: 1,
        userPlantId: 1,
        type: 'siram',
        nextDueAt: futureDate,
      );

      expect(reminder.daysUntilDue, greaterThanOrEqualTo(5));
    });

    test('daysUntilDue returns null when no due date', () {
      final reminder = PlantReminderModel(
        id: 1,
        userPlantId: 1,
        type: 'siram',
      );

      expect(reminder.daysUntilDue, isNull);
    });
  });

  group('PlantGrowthLogModel', () {
    test('fromJson parses correctly', () {
      final log = PlantGrowthLogModel.fromJson({
        'id': 1,
        'height_cm': 45.5,
        'leaves_count': 12,
        'note': 'Tumbuh subur',
        'logged_at': '2026-01-15T10:00:00.000000Z',
      });

      expect(log.id, 1);
      expect(log.heightCm, 45.5);
      expect(log.leavesCount, 12);
      expect(log.note, 'Tumbuh subur');
      expect(log.loggedAt, isNotNull);
    });
  });

  group('PlantCareLogModel', () {
    test('fromJson parses correctly', () {
      final log = PlantCareLogModel.fromJson({
        'id': 1,
        'type': 'siram',
        'note': 'Pagi hari',
        'done_at': '2026-01-15T08:00:00.000000Z',
      });

      expect(log.id, 1);
      expect(log.type, 'siram');
      expect(log.note, 'Pagi hari');
      expect(log.doneAt, isNotNull);
    });
  });
}
