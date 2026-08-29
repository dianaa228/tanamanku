import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/my_garden/garden_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('GardenProvider', () {
    late GardenProvider provider;

    setUp(() {
      provider = GardenProvider();
    });

    test('initial state has empty plants', () {
      expect(provider.plants, isEmpty);
      expect(provider.currentPlant, isNull);
      expect(provider.recommendations, isEmpty);
      expect(provider.diagnosisResult, isNull);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });

    test('countByStatus returns 0 for any status when no plants', () {
      expect(provider.countByStatus('sehat'), 0);
      expect(provider.countByStatus('perlu_air'), 0);
      expect(provider.countByStatus('perlu_perhatian'), 0);
    });

    test('activeReminders is empty when no plants', () {
      expect(provider.activeReminders, isEmpty);
    });

    test('resetDiagnosis clears diagnosis result', () {
      provider.resetDiagnosis();
      expect(provider.diagnosisResult, isNull);
    });
  });
}
