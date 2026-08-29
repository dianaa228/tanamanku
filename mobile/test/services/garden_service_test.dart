import 'package:flutter_test/flutter_test.dart';
import 'package:tanamanku/services/garden_service.dart';

void main() {
  group('GardenService', () {
    late GardenService service;

    setUp(() {
      service = GardenService();
    });

    test('service can be instantiated', () {
      expect(service, isNotNull);
      expect(service, isA<GardenService>());
    });

    test('getMyPlants method exists', () {
      expect(service.getMyPlants, isA<Function>());
    });

    test('getPlant method exists', () {
      expect(service.getPlant, isA<Function>());
    });

    test('addPlant method exists', () {
      expect(service.addPlant, isA<Function>());
    });

    test('updatePlant method exists', () {
      expect(service.updatePlant, isA<Function>());
    });

    test('deletePlant method exists', () {
      expect(service.deletePlant, isA<Function>());
    });

    test('waterPlant method exists', () {
      expect(service.waterPlant, isA<Function>());
    });

    test('addCareLog method exists', () {
      expect(service.addCareLog, isA<Function>());
    });

    test('addPhoto method exists', () {
      expect(service.addPhoto, isA<Function>());
    });

    test('getReminders method exists', () {
      expect(service.getReminders, isA<Function>());
    });

    test('addReminder method exists', () {
      expect(service.addReminder, isA<Function>());
    });

    test('markReminderDone method exists', () {
      expect(service.markReminderDone, isA<Function>());
    });

    test('getFinderQuestions method exists', () {
      expect(service.getFinderQuestions, isA<Function>());
    });

    test('getRecommendation method exists', () {
      expect(service.getRecommendation, isA<Function>());
    });

    test('diagnose method exists', () {
      expect(service.diagnose, isA<Function>());
    });
  });
}
