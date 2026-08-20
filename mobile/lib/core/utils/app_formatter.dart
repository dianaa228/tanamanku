import 'package:intl/intl.dart';

/// Formatter helper untuk Tanamanku.
class AppFormatter {
  AppFormatter._();

  static final _rupiah = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp',
    decimalDigits: 0,
  );

  static final _date = DateFormat('dd MMM yyyy', 'id_ID');
  static final _dateTime = DateFormat('dd MMM yyyy, HH:mm', 'id_ID');
  static final _shortDate = DateFormat('dd/MM/yy', 'id_ID');

  /// Format harga ke Rupiah. Contoh: 145000 → "Rp145.000"
  static String rupiah(num amount) => _rupiah.format(amount);

  /// Format tanggal. Contoh: 10 Ags 2026
  static String date(DateTime? dt) => dt != null ? _date.format(dt) : '—';

  /// Format tanggal + jam. Contoh: 10 Ags 2026, 09:15
  static String dateTime(DateTime? dt) => dt != null ? _dateTime.format(dt) : '—';

  /// Format tanggal pendek. Contoh: 10/08/26
  static String shortDate(DateTime? dt) => dt != null ? _shortDate.format(dt) : '—';

  /// Waktu relatif. Contoh: "2 jam lalu", "3 hari lalu"
  static String timeAgo(DateTime? dt) {
    if (dt == null) return '';
    final diff = DateTime.now().difference(dt);
    if (diff.inSeconds < 60) return 'Baru saja';
    if (diff.inMinutes < 60) return '${diff.inMinutes} menit lalu';
    if (diff.inHours < 24) return '${diff.inHours} jam lalu';
    if (diff.inDays < 7) return '${diff.inDays} hari lalu';
    return _date.format(dt);
  }

  /// Parsing string tanggal ke DateTime.
  static DateTime? parseDate(String? s) {
    if (s == null || s.isEmpty) return null;
    return DateTime.tryParse(s);
  }
}
