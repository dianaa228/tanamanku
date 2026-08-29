import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'seller_provider.dart';
import '../../widgets/loading_widget.dart';

class SellerDashboardPage extends StatefulWidget {
  const SellerDashboardPage({super.key});
  @override
  State<SellerDashboardPage> createState() => _SellerDashboardPageState();
}

class _SellerDashboardPageState extends State<SellerDashboardPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SellerProvider>().loadDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SellerProvider>();

    if (sp.loading && sp.dashboard == null) return const Scaffold(body: LoadingWidget(label: 'Memuat dashboard...'));
    if (sp.dashboard == null) return const Scaffold(body: Center(child: Text('Gagal memuat data')));

    final stats = sp.dashboard!['stats'] ?? {};
    final recentOrders = (sp.dashboard!['recentOrders'] as List?) ?? [];
    final lowStock = (sp.dashboard!['lowStockProducts'] as List?) ?? [];

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: RefreshIndicator(
        onRefresh: () => sp.loadDashboard(),
        child: CustomScrollView(
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 48, 20, 24),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [AppTheme.leaf600, AppTheme.leaf800]),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('🏪 Seller Dashboard', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                        ElevatedButton(
                          onPressed: () => context.push('/seller/products/create'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: AppTheme.leaf700),
                          child: const Text('➕ Produk'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('Kelola toko dan produk Anda.', style: GoogleFonts.poppins(fontSize: 13, color: Colors.white70)),
                  ],
                ),
              ),
            ),

            // Stats
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Row(
                  children: [
                    _statCard('💰', 'Penjualan', AppFormatter.rupiah(stats['totalSales'] ?? 0)),
                    const SizedBox(width: 10),
                    _statCard('📦', 'Pesanan', '${stats['totalOrders'] ?? 0}'),
                    const SizedBox(width: 10),
                    _statCard('🆕', 'Baru', '${stats['newOrders'] ?? 0}'),
                    const SizedBox(width: 10),
                    _statCard('⚠️', 'Stok Tipis', '${stats['lowStock'] ?? 0}'),
                  ],
                ),
              ),
            ),

            // Quick Actions
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                child: Text('⚡ Aksi Cepat', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
                child: GridView.count(
                  crossAxisCount: 2, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 1.6,
                  children: [
                    _quickAction('📦', 'Kelola Produk', '/seller/products', AppTheme.leaf600),
                    _quickAction('🧾', 'Pesanan', '/seller/orders', const Color(0xFF0EA5E9)),
                    _quickAction('📋', 'Inventaris', '/seller/inventory', const Color(0xFFF59E0B)),
                    _quickAction('💰', 'Penjualan', '/seller/sales', const Color(0xFF8B5CF6)),
                  ],
                ),
              ),
            ),

            // Recent Orders
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('🆕 Pesanan Terbaru', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                    TextButton(onPressed: () => context.push('/seller/orders'), child: const Text('Lihat semua →')),
                  ],
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final order = recentOrders[i];
                  return Container(
                    margin: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                    child: Row(
                      children: [
                        Container(width: 40, height: 40, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('📦', style: TextStyle(fontSize: 18)))),
                        const SizedBox(width: 12),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(order['id'] ?? '', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                          Text(order['user']?['name'] ?? '', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                        ])),
                        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                          _statusBadge(order['status']),
                          Text(AppFormatter.rupiah(order['total'] ?? 0), style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                        ]),
                      ],
                    ),
                  );
                },
                childCount: recentOrders.length,
              ),
            ),

            // Low Stock
            if (lowStock.isNotEmpty) ...[
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
                  child: Text('⚠️ Stok Menipis', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, i) {
                    final p = lowStock[i];
                    return Container(
                      margin: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(14), border: Border.all(color: const Color(0xFFEF4444).withValues(alpha: 0.2))),
                      child: Row(
                        children: [
                          const Text('⚠️', style: TextStyle(fontSize: 24)),
                          const SizedBox(width: 12),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(p['name'] ?? '', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                            Text('Sisa ${p['stock'] ?? 0}', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFFEF4444))),
                          ])),
                          TextButton(onPressed: () => context.push('/seller/inventory'), child: const Text('Atur →')),
                        ],
                      ),
                    );
                  },
                  childCount: lowStock.length,
                ),
              ),
            ],

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  Widget _statCard(String icon, String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
        child: Column(children: [
          Text(icon, style: const TextStyle(fontSize: 20)),
          const SizedBox(height: 4),
          Text(value, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text(label, style: GoogleFonts.poppins(fontSize: 9, color: AppTheme.leaf900.withValues(alpha: 0.5))),
        ]),
      ),
    );
  }

  Widget _quickAction(String icon, String label, String route, Color color) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
        child: Row(children: [
          Container(width: 40, height: 40, decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Center(child: Text(icon, style: const TextStyle(fontSize: 20)))),
          const SizedBox(width: 10),
          Expanded(child: Text(label, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600))),
        ]),
      ),
    );
  }

  Widget _statusBadge(String? status) {
    final colors = {
      'pending': [const Color(0xFFFEF3C7), const Color(0xFFD97706)],
      'processing': [const Color(0xFFDBEAFE), const Color(0xFF2563EB)],
      'shipped': [const Color(0xFFEDE9FE), const Color(0xFF7C3AED)],
      'completed': [const Color(0xFFDCFCE7), const Color(0xFF16A34A)],
      'cancelled': [const Color(0xFFFEE2E2), const Color(0xFFDC2626)],
    };
    final c = colors[status] ?? [AppTheme.leaf100, AppTheme.leaf700];
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: c[0], borderRadius: BorderRadius.circular(8)),
      child: Text(status ?? '', style: GoogleFonts.poppins(fontSize: 9, fontWeight: FontWeight.w600, color: c[1])),
    );
  }
}
