import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

/// Tema Tanamanku — Botanical Identity
/// Fresh • Botanical • Natural • Friendly • Modern • Clean
class AppTheme {
  AppTheme._();

  // ═══════════════════════════════════════════════════════════
  // TANAMANKU DESIGN SYSTEM — Botanical Colors
  // ═══════════════════════════════════════════════════════════

  // ── Primary: Botanical Green ──
  static const Color leaf50 = Color(0xFFF4F9F4);
  static const Color leaf100 = Color(0xFFE4F0E4);
  static const Color leaf200 = Color(0xFFC8E2C8);
  static const Color leaf300 = Color(0xFF9DCF9D);
  static const Color leaf400 = Color(0xFF6BB86B);
  static const Color leaf500 = Color(0xFF4A9D4A);
  static const Color leaf600 = Color(0xFF3A8A3A);
  static const Color leaf700 = Color(0xFF2F6F2F);
  static const Color leaf800 = Color(0xFF2A5A2A);
  static const Color leaf900 = Color(0xFF234A23);
  static const Color leaf950 = Color(0xFF0F2D0F);

  // ── Secondary: Sage ──
  static const Color sage50 = Color(0xFFF6F8F5);
  static const Color sage100 = Color(0xFFE8EDE6);
  static const Color sage200 = Color(0xFFD1DBCD);
  static const Color sage300 = Color(0xFFB3C4AD);

  // ── Accent: Warm Terracotta ──
  static const Color terra50 = Color(0xFFFDF5F0);
  static const Color terra100 = Color(0xFFFAE8DC);
  static const Color terra400 = Color(0xFFE0926A);
  static const Color terra500 = Color(0xFFD47844);
  static const Color terra600 = Color(0xFFC5653A);

  // ── Accent: Muted Yellow / Sun ──
  static const Color sun50 = Color(0xFFFEFCE8);
  static const Color sun100 = Color(0xFFFEF9C3);
  static const Color sun300 = Color(0xFFFDE047);
  static const Color sun400 = Color(0xFFFACC15);

  // ── Background ──
  static const Color cream = Color(0xFFFAF8F5);
  static const Color warmWhite = Color(0xFFFDFCFA);

  // ── Text ──
  static const Color forest = Color(0xFF1A2E1A);
  static const Color forestLight = Color(0xFF2D4A2D);
  static const Color muted = Color(0xFF6B7C6B);
  static const Color mutedLight = Color(0xFF8FA08F);

  // ═══════════════════════════════════════════════════════════
  // SHADOWS
  // ═══════════════════════════════════════════════════════════
  static List<BoxShadow> get softShadow => [
    BoxShadow(color: leaf900.withValues(alpha: 0.03), blurRadius: 12, offset: const Offset(0, 4)),
    BoxShadow(color: leaf900.withValues(alpha: 0.02), blurRadius: 24, offset: const Offset(0, 8)),
  ];

  static List<BoxShadow> get cardShadow => [
    BoxShadow(color: leaf900.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2)),
    BoxShadow(color: leaf900.withValues(alpha: 0.03), blurRadius: 16, offset: const Offset(0, 6)),
  ];

  static List<BoxShadow> get liftShadow => [
    BoxShadow(color: leaf600.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 6)),
    BoxShadow(color: leaf900.withValues(alpha: 0.05), blurRadius: 40, offset: const Offset(0, 12)),
  ];

  // ═══════════════════════════════════════════════════════════
  // DECORATIONS
  // ═══════════════════════════════════════════════════════════
  static BoxDecoration get glassDecoration => BoxDecoration(
    color: Colors.white.withValues(alpha: 0.82),
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: sage200.withValues(alpha: 0.3)),
    boxShadow: softShadow,
  );

  // ═══════════════════════════════════════════════════════════
  // LIGHT THEME
  // ═══════════════════════════════════════════════════════════
  static ThemeData get light {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: leaf600,
      brightness: Brightness.light,
      primary: leaf600,
      onPrimary: Colors.white,
      primaryContainer: leaf100,
      onPrimaryContainer: leaf900,
      secondary: sun400,
      onSecondary: forest,
      tertiary: terra500,
      onTertiary: Colors.white,
      surface: warmWhite,
      onSurface: forest,
      error: const Color(0xFFEF4444),
      onError: Colors.white,
      surfaceContainerHighest: leaf50,
    );

    final textTheme = GoogleFonts.plusJakartaSansTextTheme().apply(
      bodyColor: forest,
      displayColor: forest,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      scaffoldBackgroundColor: cream,

      // ── AppBar ──
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white.withValues(alpha: 0.82),
        foregroundColor: forest,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 17,
          fontWeight: FontWeight.w700,
          color: forest,
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
          borderRadius: BorderRadius.circular(18),
          side: BorderSide(color: sage200.withValues(alpha: 0.5)),
        ),
        shadowColor: leaf900.withValues(alpha: 0.04),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      ),

      // ── Elevated Button ──
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: leaf600,
          foregroundColor: Colors.white,
          elevation: 0,
          shadowColor: leaf600.withValues(alpha: 0.25),
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 15),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
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
          side: const BorderSide(color: sage200),
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 15),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
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
        fillColor: sage50,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: sage200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: sage200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: leaf500, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFEF4444)),
        ),
        hintStyle: GoogleFonts.plusJakartaSans(color: mutedLight, fontSize: 14),
        labelStyle: GoogleFonts.plusJakartaSans(color: muted, fontSize: 14),
      ),

      // ── Bottom Navigation ──
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: leaf600,
        unselectedItemColor: mutedLight,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
        unselectedLabelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
      ),

      // ── Chip ──
      chipTheme: ChipThemeData(
        backgroundColor: leaf50,
        selectedColor: leaf600,
        labelStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        side: const BorderSide(color: sage200),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      ),

      // ── Dialog ──
      dialogTheme: DialogThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
        backgroundColor: Colors.white,
        elevation: 0,
        titleTextStyle: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w700, color: forest),
        contentTextStyle: GoogleFonts.plusJakartaSans(fontSize: 14, color: forestLight),
      ),

      // ── Bottom Sheet ──
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        showDragHandle: true,
        dragHandleColor: sage200,
      ),

      // ── Snackbar ──
      snackBarTheme: SnackBarThemeData(
        backgroundColor: forest,
        contentTextStyle: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
