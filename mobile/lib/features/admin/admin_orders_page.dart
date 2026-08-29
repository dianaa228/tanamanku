import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminOrdersPage extends StatefulWidget {
  const AdminOrdersPage({super.key});
  @override
  State<AdminOrdersPage> createState() => _AdminOrdersPageState();
}

class _AdminOrdersPageState extends State<AdminOrdersPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadOrders());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('🧾 Semua Pesanan')),
      body: ap.loading ? const LoadingWidget() : RefreshIndicator(
        onRefresh: () => ap.loadOrders(),
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: ap.orders.length,
          itemBuilder: (context, i) {
            final o = ap.orders[i];
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
              child: Row(children: [
                Container(width: 40, height: 40, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('📦'))),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(o['id'] ?? o['order_number'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                  Text('${o['user']?['name'] ?? ''} · ${o['store']?['name'] ?? ''}', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                ])),
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  Text(AppFormatter.rupiah(o['total'] ?? 0), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                  Text(o['status'] ?? '', style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                ]),
              ]),
            );
          },
        ),
      ),
    );
  }
}
