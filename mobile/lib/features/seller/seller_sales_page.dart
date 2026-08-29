import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'seller_provider.dart';
import '../../widgets/loading_widget.dart';

class SellerSalesPage extends StatefulWidget {
  const SellerSalesPage({super.key});
  @override
  State<SellerSalesPage> createState() => _SellerSalesPageState();
}

class _SellerSalesPageState extends State<SellerSalesPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<SellerProvider>().loadSales());
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SellerProvider>();
    if (sp.loading && sp.sales == null) return const Scaffold(body: LoadingWidget(label: 'Memuat laporan...'));
    if (sp.sales == null) return const Scaffold(body: Center(child: Text('Gagal memuat data')));

    final topProducts = (sp.sales!['topProducts'] as List?) ?? [];

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('💰 Laporan Penjualan')),
      body: RefreshIndicator(
        onRefresh: () => sp.loadSales(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Stats
              Row(children: [
                _statCard('💰', 'Total Revenue', AppFormatter.rupiah(sp.sales!['totalRevenue'] ?? 0)),
                const SizedBox(width: 10),
                _statCard('📦', 'Total Order', '${sp.sales!['totalOrders'] ?? 0}'),
              ]),
              const SizedBox(height: 10),
              _statCard('📊', 'Rata-rata Order', AppFormatter.rupiah(sp.sales!['avgOrderValue'] ?? 0)),

              const SizedBox(height: 24),
              Text('🏆 Produk Terlaris', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),

              ...topProducts.map((p) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                child: Row(children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(p['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                    Text('${p['sold'] ?? 0} terjual', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                  ])),
                  Text(AppFormatter.rupiah(p['revenue'] ?? 0), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                ]),
              )),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statCard(String icon, String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(icon, style: const TextStyle(fontSize: 20)),
          const SizedBox(height: 6),
          Text(value, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text(label, style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5))),
        ]),
      ),
    );
  }
}
