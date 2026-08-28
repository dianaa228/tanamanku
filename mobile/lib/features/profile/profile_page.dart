import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../features/auth/auth_provider.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    if (user == null) {
      return Scaffold(
        backgroundColor: AppTheme.cream,
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('🔐', style: TextStyle(fontSize: 56)),
              const SizedBox(height: 16),
              Text('Masuk dulu yuk', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              Text('Masuk untuk mengakses profil & kebunmu', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(onPressed: () => context.push('/login'), child: const Text('Masuk')),
                  const SizedBox(width: 12),
                  OutlinedButton(onPressed: () => context.push('/register'), child: const Text('Daftar')),
                ],
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ── Profil card ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(20, 48, 20, 24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [AppTheme.leaf600, AppTheme.leaf800],
                ),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.white.withValues(alpha: 0.15),
                    child: Text(user.avatar ?? '🧑‍🌾', style: const TextStyle(fontSize: 36)),
                  ),
                  const SizedBox(height: 12),
                  Text(user.name, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(
                    '${user.email} · ${user.phone ?? ''}',
                    style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withValues(alpha: 0.7)),
                  ),
                  if (user.memberSince != null)
                    Text(
                      'Bergabung ${AppFormatter.date(AppFormatter.parseDate(user.memberSince))}',
                      style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withValues(alpha: 0.5)),
                    ),
                ],
              ),
            ),

            // ── Statistik ──
            Padding(
              padding: const EdgeInsets.fromLTRB(20, -16, 20, 0),
              child: Row(
                children: [
                  _statCard('🪴', '${user.stats?['plants'] ?? 0}', 'Tanaman'),
                  const SizedBox(width: 10),
                  _statCard('📦', '${user.stats?['orders'] ?? 0}', 'Pesanan'),
                  const SizedBox(width: 10),
                  _statCard('💬', '${user.stats?['posts'] ?? 0}', 'Post'),
                ],
              ),
            ),

            // ── Menu ──
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Column(
                children: [
                  _menuItem(context, '📦', 'Pesanan saya', '/orders', 'Pantau status pesanan'),
                  _menuItem(context, '🪴', 'My Garden', '/my-garden', 'Kelola tanaman'),
                  _menuItem(context, '💡', 'Plant Finder', '/plant-finder', 'Cari tanaman ideal'),
                  _menuItem(context, '🩺', 'Plant Diagnosis', '/plant-diagnosis', 'Cek kesehatan'),
                  _menuItem(context, '💬', 'Komunitas', '/community', 'Berbagi cerita'),
                ],
              ),
            ),

            // ── Logout ──
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 40),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () async {
                    await auth.logout();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sampai jumpa! 👋')));
                      context.go('/');
                    }
                  },
                  icon: const Icon(Icons.logout_rounded, size: 18, color: Color(0xFFEF4444)),
                  label: Text('Keluar dari akun', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFFEF4444))),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFEF4444)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statCard(String icon, String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.leaf100),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 4),
            Text(value, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800)),
            Text(label, style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5))),
          ],
        ),
      ),
    );
  }

  Widget _menuItem(BuildContext context, String icon, String label, String route, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(14)),
          child: Center(child: Text(icon, style: const TextStyle(fontSize: 22))),
        ),
        title: Text(label, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
        subtitle: Text(desc, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
        trailing: Icon(Icons.chevron_right_rounded, color: AppTheme.leaf900.withValues(alpha: 0.3)),
        onTap: () => context.push(route),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        tileColor: Colors.white,
      ),
    );
  }
}
