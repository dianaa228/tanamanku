import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Tema aplikasi Tanamanku — palette hijau kebun.
class AppTheme {
  AppTheme._();

  // ── Warna ──────────────────────────────────────────────
  static const Color leaf50 = Color(0xFFF0FDF4);
  static const Color leaf100 = Color(0xFFDCFCE7);
  static const Color leaf200 = Color(0xFFBBF7D0);
  static const Color leaf400 = Color(0xFF4ADE80);
  static const Color leaf500 = Color(0xFF22C55E);
  static const Color leaf600 = Color(0xFF16A34A);
  static const Color leaf700 = Color(0xFF15803D);
  static const Color leaf800 = Color(0xFF166534);
  static const Color leaf900 = Color(0xFF14532D);
  static const Color leaf950 = Color(0xFF052E16);

  static const Color cream = Color(0xFFFFFBF5);
  static const Color sun300 = Color(0xFFFDE047);
  static const Color sun400 = Color(0xFFFACC15);
  static const Color sun500 = Color(0xFFEAB308);

  // ── Tema Terang ──────────────────────────────────────
  static ThemeData get light {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: leaf600,
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
    );

    final textTheme = GoogleFonts.poppinsTextTheme();

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: cream,

      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: leaf950,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w700,
          color: leaf950,
        ),
      ),

      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: leaf100),
        ),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: leaf600,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          textStyle: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: leaf700,
          side: const BorderSide(color: leaf200),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          textStyle: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: leaf200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: leaf200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: leaf500, width: 2),
        ),
        hintStyle: GoogleFonts.poppins(color: Colors.grey.shade400, fontSize: 14),
      ),

      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: leaf600,
        unselectedItemColor: leaf900,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
