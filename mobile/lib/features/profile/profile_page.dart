import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
      return AnnotatedRegion<SystemUiOverlayStyle>(
        value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.dark),
        child: Scaffold(
          backgroundColor: AppTheme.cream,
          body: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80, height: 80,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppTheme.leaf400, AppTheme.leaf600]),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Center(child: Text('🔐', style: TextStyle(fontSize: 36))),
                ),
                const SizedBox(height: 20),
                Text('Masuk dulu yuk', style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.leaf950)),
                const SizedBox(height: 8),
                Text('Masuk untuk mengakses profil & kebunmu', style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppTheme.leaf400)),
                const SizedBox(height: 28),
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
        ),
      );
    }

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.light),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            children: [
              // ── Profil card ──
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 56, 20, 32),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF16A34A), Color(0xFF15803D), Color(0xFF166534)],
                  ),
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 80, height: 80,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                      ),
                      child: Center(child: Text(user.avatar ?? '🧑‍🌾', style: const TextStyle(fontSize: 40))),
                    ),
                    const SizedBox(height: 16),
                    Text(user.name, style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                    const SizedBox(height: 4),
                    Text(
                      '${user.email} · ${user.phone ?? ''}',
                      style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.white.withValues(alpha: 0.7)),
                    ),
                    if (user.memberSince != null)
                      Text(
                        'Bergabung ${AppFormatter.date(AppFormatter.parseDate(user.memberSince))}',
                        style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.white.withValues(alpha: 0.5)),
                      ),
                  ],
                ),
              ),

              // ── Statistik ──
              Padding(
                padding: const EdgeInsets.fromLTRB(20, -20, 20, 0),
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

              // ── Menu Utama ──
              _menuSection('🗂️ Menu Utama', [
                _menuItem(context, '📦', 'Pesanan saya', '/orders', 'Pantau status pesanan'),
                _menuItem(context, '🪴', 'My Garden', '/my-garden', 'Kelola tanaman'),
                _menuItem(context, '🔔', 'Notifikasi', '/notifications', 'Lihat notifikasi'),
                _menuItem(context, '⭐', 'Langganan', '/subscription', 'Kelola paket langganan'),
                _menuItem(context, '💬', 'Komunitas', '/community', 'Berbagi cerita'),
              ]),

              // ── Fitur Lainnya ──
              _menuSection('🌿 Fitur Lainnya', [
                _menuItem(context, '💡', 'Plant Finder', '/plant-finder', 'Cari tanaman ideal'),
                _menuItem(context, '🩺', 'Plant Diagnosis', '/plant-diagnosis', 'Cek kesehatan'),
                _menuItem(context, '🔄', 'Plant Exchange', '/plant-exchange', 'Tukar tanaman'),
                _menuItem(context, '📦', 'Listing Saya', '/my-listings', 'Kelola listing'),
                _menuItem(context, '🔧', 'Jasa Berkebun', '/services', 'Lihat jasa'),
                _menuItem(context, '📋', 'Booking Saya', '/my-bookings', 'Riwayat booking'),
              ]),

              // ── Seller Panel ──
              if (user.role == 'seller' || user.role == 'admin')
                _menuSection('🏪 Seller Panel', [
                  _menuItem(context, '📊', 'Dashboard Seller', '/seller', 'Kelola toko'),
                  _menuItem(context, '📦', 'Kelola Produk', '/seller/products', 'Tambah & edit produk'),
                  _menuItem(context, '🧾', 'Pesanan Toko', '/seller/orders', 'Proses pesanan'),
                  _menuItem(context, '💰', 'Penjualan', '/seller/sales', 'Laporan keuangan'),
                ]),

              // ── Admin Panel ──
              if (user.role == 'admin')
                _menuSection('🛡️ Admin Panel', [
                  _menuItem(context, '📊', 'Dashboard Admin', '/admin', 'Pusat kontrol'),
                  _menuItem(context, '👥', 'Pengguna', '/admin/users', 'Kelola pengguna'),
                  _menuItem(context, '🏪', 'Toko', '/admin/stores', 'Verifikasi toko'),
                  _menuItem(context, '📈', 'Analytics', '/admin/analytics', 'Data analytics'),
                  _menuItem(context, '⚙️', 'Pengaturan', '/admin/settings', 'Konfigurasi'),
                ]),

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
                    label: Text('Keluar dari akun', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFFEF4444))),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFEF4444)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statCard(String icon, String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 4),
            Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.leaf950)),
            Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppTheme.leaf400)),
          ],
        ),
      ),
    );
  }

  Widget _menuSection(String title, List<Widget> children) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.leaf400)),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2)),
              ],
            ),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }

  Widget _menuItem(BuildContext context, String icon, String label, String route, String desc) {
    return ListTile(
      leading: Container(
        width: 40, height: 40,
        decoration: BoxDecoration(
          color: AppTheme.leaf50,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(child: Text(icon, style: const TextStyle(fontSize: 20))),
      ),
      title: Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.leaf950)),
      subtitle: Text(desc, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.leaf400)),
      trailing: Icon(Icons.chevron_right_rounded, color: AppTheme.leaf300, size: 20),
      onTap: () => context.push(route),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
    );
  }
}
