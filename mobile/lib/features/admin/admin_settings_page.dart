import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';

class AdminSettingsPage extends StatelessWidget {
  const AdminSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('⚙️ Pengaturan')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _section('Umum', [
            _tile('🏪', 'Nama Platform', 'Tanamanku'),
            _tile('🌐', 'URL Platform', 'tanamanku.id'),
            _tile('📧', 'Email Admin', 'admin@tanamanku.id'),
          ]),
          const SizedBox(height: 16),
          _section('Keamanan', [
            _tile('🔐', 'Session Timeout', '120 menit'),
            _tile('🔑', 'BCrypt Rounds', '12'),
            _tile('🛡️', 'Rate Limiting', 'Aktif'),
          ]),
          const SizedBox(height: 16),
          _section('Pembayaran', [
            _tile('💳', 'Payment Provider', 'Stub (Dev)'),
            _tile('🔗', 'Webhook Secret', '••••••••'),
          ]),
        ],
      ),
    );
  }

  Widget _section(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.leaf950)),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
          child: Column(children: children),
        ),
      ],
    );
  }

  Widget _tile(String icon, String label, String value) {
    return ListTile(
      leading: Text(icon, style: const TextStyle(fontSize: 22)),
      title: Text(label, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
      subtitle: Text(value, style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5))),
      trailing: const Icon(Icons.chevron_right_rounded, color: AppTheme.leaf300),
    );
  }
}
