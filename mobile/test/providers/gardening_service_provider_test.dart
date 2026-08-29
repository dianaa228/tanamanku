import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/services/gardening_service_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('GardeningServiceProvider', () {
    late GardeningServiceProvider provider;

    setUp(() {
      provider = GardeningServiceProvider();
    });

    test('initial state has empty lists', () {
      expect(provider.services, isEmpty);
      expect(provider.currentService, isNull);
      expect(provider.bookings, isEmpty);
    });

    test('initial filterCategory is null', () {
      expect(provider.filterCategory, isNull);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });
  });
}
