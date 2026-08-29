import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});
  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadDashboard());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    if (ap.loading && ap.dashboard == null) return const Scaffold(body: LoadingWidget(label: 'Memuat dashboard admin...'));
    if (ap.dashboard == null) return const Scaffold(body: Center(child: Text('Gagal memuat data')));

    final stats = ap.dashboard!['stats'] ?? {};
    final recentOrders = (ap.dashboard!['recentOrders'] as List?) ?? [];

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.light),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        body: RefreshIndicator(
          onRefresh: () => ap.loadDashboard(),
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Container(
                  padding: const EdgeInsets.fromLTRB(20, 56, 20, 24),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft, end: Alignment.bottomRight,
                      colors: [Color(0xFF16A34A), Color(0xFF15803D), Color(0xFF166534)],
                    ),
                    borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('🛡️ Admin Panel', style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                    const SizedBox(height: 4),
                    Text('Selamat datang di pusat kontrol Tanamanku.', style: GoogleFonts.plusJakartaSans(fontSize: 13, color: Colors.white.withValues(alpha: 0.7))),
                  ]),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                  child: Row(children: [
                    _statCard('👥', 'Pengguna', '${stats['totalUsers'] ?? 0}'), const SizedBox(width: 10),
                    _statCard('🏪', 'Toko', '${stats['totalStores'] ?? 0}'), const SizedBox(width: 10),
                    _statCard('📦', 'Produk', '${stats['totalProducts'] ?? 0}'), const SizedBox(width: 10),
                    _statCard('🧾', 'Pesanan', '${stats['totalOrders'] ?? 0}'),
                  ]),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                  child: Text('⚡ Aksi Cepat', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.leaf950)),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
                  child: GridView.count(
                    crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 8, mainAxisSpacing: 8, childAspectRatio: 1.2,
                    children: [
                      _action('👥', 'Pengguna', '/admin/users', const Color(0xFF0EA5E9)),
                      _action('🏪', 'Toko', '/admin/stores', const Color(0xFFF59E0B)),
                      _action('🏷️', 'Kategori', '/admin/categories', AppTheme.leaf600),
                      _action('🧾', 'Pesanan', '/admin/orders', const Color(0xFF8B5CF6)),
                      _action('💳', 'Pembayaran', '/admin/payments', const Color(0xFFEF4444)),
                      _action('💬', 'Komunitas', '/admin/community', const Color(0xFF06B6D4)),
                      _action('📈', 'Laporan', '/admin/reports', const Color(0xFF6366F1)),
                      _action('📊', 'Analytics', '/admin/analytics', AppTheme.leaf600),
                      _action('⚙️', 'Pengaturan', '/admin/settings', const Color(0xFF6B7280)),
                    ],
                  ),
                ),
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                  child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text('🆕 Pesanan Terbaru', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.leaf950)),
                    TextButton(onPressed: () => context.push('/admin/orders'), child: Text('Lihat semua →', style: GoogleFonts.plusJakartaSans(color: AppTheme.leaf600))),
                  ]),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate((context, i) {
                  final o = recentOrders[i];
                  return Container(
                    margin: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white, borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
                    ),
                    child: Row(children: [
                      Container(width: 44, height: 44, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(14)), child: const Center(child: Text('📦', style: TextStyle(fontSize: 20)))),
                      const SizedBox(width: 12),
                      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(o['id'] ?? '', style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w600)),
                        Text('${o['user']?['name'] ?? ''} · ${o['store']?['name'] ?? ''}', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.leaf400)),
                      ])),
                      Text(AppFormatter.rupiah(o['total'] ?? 0), style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                    ]),
                  );
                }, childCount: recentOrders.length),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statCard(String icon, String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(children: [
          Text(icon, style: const TextStyle(fontSize: 18)), const SizedBox(height: 4),
          Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.leaf950)),
          Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 9, color: AppTheme.leaf400)),
        ]),
      ),
    );
  }

  Widget _action(String icon, String label, String route, Color color) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(14),
          boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Container(width: 36, height: 36, decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)), child: Center(child: Text(icon, style: const TextStyle(fontSize: 18)))),
          const SizedBox(height: 6),
          Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.leaf950), textAlign: TextAlign.center),
        ]),
      ),
    );
  }
}
