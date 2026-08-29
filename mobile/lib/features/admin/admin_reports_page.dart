import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminReportsPage extends StatefulWidget {
  const AdminReportsPage({super.key});
  @override
  State<AdminReportsPage> createState() => _AdminReportsPageState();
}

class _AdminReportsPageState extends State<AdminReportsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadDashboard());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    final stats = ap.dashboard?['stats'] ?? {};
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('📈 Laporan')),
      body: ap.loading ? const LoadingWidget() : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          _card('🧾', 'Total Pesanan', '${stats['totalOrders'] ?? 0}'),
          _card('💰', 'Total GMV', 'Rp${((stats['gmv'] ?? 0) / 1000000).toStringAsFixed(1)}Jt'),
          _card('👥', 'Total Pengguna', '${stats['totalUsers'] ?? 0}'),
          _card('🏪', 'Total Toko', '${stats['totalStores'] ?? 0}'),
          _card('📦', 'Total Produk', '${stats['totalProducts'] ?? 0}'),
          _card('🆕', 'Pengguna Baru (Bulan Ini)', '${stats['newUsersThisMonth'] ?? 0}'),
        ]),
      ),
    );
  }

  Widget _card(String icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
      child: Row(children: [
        Text(icon, style: const TextStyle(fontSize: 28)),
        const SizedBox(width: 16),
        Expanded(child: Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w600))),
        Text(value, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.leaf700)),
      ]),
    );
  }
}
