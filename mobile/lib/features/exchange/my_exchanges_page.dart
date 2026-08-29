import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';

class MyExchangesPage extends StatelessWidget {
  const MyExchangesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('🔄 Tukar Saya')),
      body: Center(
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Text('🔄', style: TextStyle(fontSize: 56)),
          const SizedBox(height: 12),
          Text('Belum ada pertukaran', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text('Ajukan tawaran untuk menukar tanaman', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
        ]),
      ),
    );
  }
}
