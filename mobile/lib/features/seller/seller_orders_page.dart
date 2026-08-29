import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../services/seller_service.dart';
import 'seller_provider.dart';
import '../../widgets/loading_widget.dart';

class SellerOrdersPage extends StatefulWidget {
  const SellerOrdersPage({super.key});
  @override
  State<SellerOrdersPage> createState() => _SellerOrdersPageState();
}

class _SellerOrdersPageState extends State<SellerOrdersPage> {
  String _tab = 'all';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<SellerProvider>().loadOrders());
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SellerProvider>();
    final filtered = _tab == 'all' ? sp.orders : sp.orders.where((o) => o['status'] == _tab).toList();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('🧾 Pesanan Toko')),
      body: sp.loading
          ? const LoadingWidget()
          : Column(
              children: [
                // Tabs
                SizedBox(
                  height: 44,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    children: [
                      _tabChip('Semua', 'all'), _tabChip('Baru', 'pending'), _tabChip('Diproses', 'processing'),
                      _tabChip('Dikirim', 'shipped'), _tabChip('Selesai', 'completed'),
                    ],
                  ),
                ),
                Expanded(
                  child: filtered.isEmpty
                      ? Center(child: Text('Tidak ada pesanan', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.5))))
                      : RefreshIndicator(
                          onRefresh: () => sp.loadOrders(),
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: filtered.length,
                            itemBuilder: (context, i) {
                              final o = filtered[i];
                              return Container(
                                margin: const EdgeInsets.only(bottom: 10),
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                    Text(o['id'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13)),
                                    _statusBadge(o['status']),
                                  ]),
                                  const SizedBox(height: 6),
                                  Text(o['user']?['name'] ?? '', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                                  const SizedBox(height: 4),
                                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                    Text(AppFormatter.rupiah(o['total'] ?? 0), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                                    if (o['status'] == 'pending')
                                      ElevatedButton(
                                        onPressed: () async { await SellerService().updateOrderStatus(o['id'], 'processing'); sp.loadOrders(); },
                                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6)),
                                        child: const Text('Proses', style: TextStyle(fontSize: 11)),
                                      ),
                                  ]),
                                ]),
                              );
                            },
                          ),
                        ),
                ),
              ],
            ),
    );
  }

  Widget _tabChip(String label, String value) {
    final selected = _tab == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label, style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
        selected: selected, onSelected: (_) => setState(() => _tab = value),
        selectedColor: AppTheme.leaf600, checkmarkColor: Colors.white,
        labelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
        side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
    );
  }

  Widget _statusBadge(String? status) {
    final labels = {'pending': 'Baru', 'processing': 'Diproses', 'shipped': 'Dikirim', 'completed': 'Selesai', 'cancelled': 'Batal'};
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
      child: Text(labels[status] ?? status ?? '', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: c[1])),
    );
  }
}
