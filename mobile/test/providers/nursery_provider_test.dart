import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tanamanku/features/nursery/nursery_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('NurseryProvider', () {
    late NurseryProvider provider;

    setUp(() {
      provider = NurseryProvider();
    });

    test('initial state has empty lists', () {
      expect(provider.nurseries, isEmpty);
      expect(provider.currentNursery, isNull);
      expect(provider.nurseryProducts, isEmpty);
    });

    test('initial loading is false', () {
      expect(provider.loading, false);
    });

    test('initial error is null', () {
      expect(provider.error, isNull);
    });
  });
}
