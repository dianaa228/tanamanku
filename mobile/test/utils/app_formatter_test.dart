import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:tanamanku/core/utils/app_formatter.dart';

void main() {
  setUpAll(() async {
    await initializeDateFormatting('id_ID', null);
  });

  group('AppFormatter', () {
    group('rupiah', () {
      test('formats positive amount correctly', () {
        expect(AppFormatter.rupiah(145000), 'Rp145.000');
      });

      test('formats zero amount', () {
        expect(AppFormatter.rupiah(0), 'Rp0');
      });

      test('formats large amount', () {
        expect(AppFormatter.rupiah(1000000), 'Rp1.000.000');
      });

      test('formats small amount', () {
        expect(AppFormatter.rupiah(5000), 'Rp5.000');
      });

      test('formats decimal amount', () {
        expect(AppFormatter.rupiah(145000.50), isNotEmpty);
      });
    });

    group('date', () {
      test('formats date correctly', () {
        final dt = DateTime(2026, 1, 15);
        expect(AppFormatter.date(dt), isNotEmpty);
      });

      test('returns dash for null', () {
        expect(AppFormatter.date(null), '—');
      });
    });

    group('dateTime', () {
      test('formats datetime correctly', () {
        final dt = DateTime(2026, 1, 15, 9, 15);
        expect(AppFormatter.dateTime(dt), isNotEmpty);
      });

      test('returns dash for null', () {
        expect(AppFormatter.dateTime(null), '—');
      });
    });

    group('shortDate', () {
      test('formats short date correctly', () {
        final dt = DateTime(2026, 8, 10);
        final result = AppFormatter.shortDate(dt);
        expect(result, contains('/'));
      });

      test('returns dash for null', () {
        expect(AppFormatter.shortDate(null), '—');
      });
    });

    group('timeAgo', () {
      test('returns "Baru saja" for very recent time', () {
        final now = DateTime.now();
        expect(AppFormatter.timeAgo(now), 'Baru saja');
      });

      test('returns minutes ago', () {
        final fiveMinAgo = DateTime.now().subtract(const Duration(minutes: 5));
        expect(AppFormatter.timeAgo(fiveMinAgo), '5 menit lalu');
      });

      test('returns hours ago', () {
        final threeHoursAgo = DateTime.now().subtract(const Duration(hours: 3));
        expect(AppFormatter.timeAgo(threeHoursAgo), '3 jam lalu');
      });

      test('returns days ago', () {
        final twoDaysAgo = DateTime.now().subtract(const Duration(days: 2));
        expect(AppFormatter.timeAgo(twoDaysAgo), '2 hari lalu');
      });

      test('returns formatted date for old dates', () {
        final tenDaysAgo = DateTime.now().subtract(const Duration(days: 10));
        final result = AppFormatter.timeAgo(tenDaysAgo);
        expect(result, isNotEmpty);
        expect(result, isNot(contains('lalu')));
      });

      test('returns empty for null', () {
        expect(AppFormatter.timeAgo(null), '');
      });
    });

    group('parseDate', () {
      test('parses valid date string', () {
        final result = AppFormatter.parseDate('2026-01-15');
        expect(result, isNotNull);
        expect(result!.year, 2026);
        expect(result.month, 1);
        expect(result.day, 15);
      });

      test('returns null for null string', () {
        expect(AppFormatter.parseDate(null), isNull);
      });

      test('returns null for empty string', () {
        expect(AppFormatter.parseDate(''), isNull);
      });

      test('returns null for invalid string', () {
        expect(AppFormatter.parseDate('not-a-date'), isNull);
      });
    });
  });
}
