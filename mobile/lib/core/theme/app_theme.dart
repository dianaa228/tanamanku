import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

/// Tema aplikasi Tanamanku — Modern glassmorphism design
class AppTheme {
  AppTheme._();

  // ── Warna ──────────────────────────────────────────────
  static const Color leaf50 = Color(0xFFF0FDF4);
  static const Color leaf100 = Color(0xFFDCFCE7);
  static const Color leaf200 = Color(0xFFBBF7D0);
  static const Color leaf300 = Color(0xFF86EFAC);
  static const Color leaf400 = Color(0xFF4ADE80);
  static const Color leaf500 = Color(0xFF22C55E);
  static const Color leaf600 = Color(0xFF16A34A);
  static const Color leaf700 = Color(0xFF15803D);
  static const Color leaf800 = Color(0xFF166534);
  static const Color leaf900 = Color(0xFF14532D);
  static const Color leaf950 = Color(0xFF052E16);

  static const Color cream = Color(0xFFFAFAF9);
  static const Color creamDark = Color(0xFFF5F5F4);
  static const Color sun300 = Color(0xFFFDE047);
  static const Color sun400 = Color(0xFFFACC15);
  static const Color sun500 = Color(0xFFEAB308);

  // ── Modern Shadows ──────────────────────────────────────
  static List<BoxShadow> get softShadow => [
    BoxShadow(color: leaf900.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4)),
    BoxShadow(color: leaf900.withValues(alpha: 0.02), blurRadius: 24, offset: const Offset(0, 8)),
  ];

  static List<BoxShadow> get liftShadow => [
    BoxShadow(color: leaf600.withValues(alpha: 0.12), blurRadius: 24, offset: const Offset(0, 8)),
    BoxShadow(color: leaf900.withValues(alpha: 0.06), blurRadius: 48, offset: const Offset(0, 16)),
  ];

  // ── Glass Effect ──────────────────────────────────────
  static BoxDecoration get glassDecoration => BoxDecoration(
    color: Colors.white.withValues(alpha: 0.85),
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: Colors.white.withValues(alpha: 0.6)),
    boxShadow: softShadow,
  );

  // ── Tema Terang ──────────────────────────────────────
  static ThemeData get light {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: leaf600,
      brightness: Brightness.light,
      primary: leaf600,
      onPrimary: Colors.white,
      primaryContainer: leaf100,
      onPrimaryContainer: leaf900,
      secondary: sun400,
      onSecondary: leaf950,
      surface: Colors.white,
      onSurface: leaf950,
      error: const Color(0xFFEF4444),
      onError: Colors.white,
      surfaceContainerHighest: leaf50,
    );

    final textTheme = GoogleFonts.plusJakartaSansTextTheme();

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: cream,

      // ── AppBar ──
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white.withValues(alpha: 0.8),
        foregroundColor: leaf950,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: leaf950,
        ),
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
        ),
      ),

      // ── Cards ──
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: leaf100.withValues(alpha: 0.8)),
        ),
        shadowColor: leaf900.withValues(alpha: 0.05),
      ),

      // ── Elevated Button ──
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: leaf600,
          foregroundColor: Colors.white,
          elevation: 0,
          shadowColor: leaf600.withValues(alpha: 0.3),
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
      ),

      // ── Outlined Button ──
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: leaf700,
          side: BorderSide(color: leaf200),
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
      ),

      // ── Text Button ──
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: leaf600,
          textStyle: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ),

      // ── Input ──
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: leaf50.withValues(alpha: 0.5),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: leaf200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: leaf200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: leaf500, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFEF4444)),
        ),
        hintStyle: GoogleFonts.plusJakartaSans(color: leaf300, fontSize: 14),
        labelStyle: GoogleFonts.plusJakartaSans(color: leaf700, fontSize: 14),
      ),

      // ── Bottom Navigation ──
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: leaf600,
        unselectedItemColor: leaf400,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
        unselectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
      ),

      // ── Chip ──
      chipTheme: ChipThemeData(
        backgroundColor: leaf50,
        selectedColor: leaf600,
        labelStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        side: BorderSide(color: leaf200),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      ),

      // ── Dialog ──
      dialogTheme: DialogThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        backgroundColor: Colors.white,
        elevation: 0,
        titleTextStyle: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w700, color: leaf950),
        contentTextStyle: GoogleFonts.plusJakartaSans(fontSize: 14, color: leaf900),
      ),

      // ── Bottom Sheet ──
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        showDragHandle: true,
        dragHandleColor: leaf200,
      ),

      // ── Snackbar ──
      snackBarTheme: SnackBarThemeData(
        backgroundColor: leaf950,
        contentTextStyle: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
