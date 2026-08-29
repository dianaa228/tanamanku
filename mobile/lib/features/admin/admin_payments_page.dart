import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminPaymentsPage extends StatefulWidget {
  const AdminPaymentsPage({super.key});
  @override
  State<AdminPaymentsPage> createState() => _AdminPaymentsPageState();
}

class _AdminPaymentsPageState extends State<AdminPaymentsPage> {
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
      appBar: AppBar(title: const Text('💳 Pembayaran')),
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
                const Icon(Icons.payment, color: AppTheme.leaf600), const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(o['id'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                  Text(o['user']?['name'] ?? '', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                ])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: o['payment_status'] == 'paid' ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(o['payment_status'] ?? 'pending', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: o['payment_status'] == 'paid' ? const Color(0xFF16A34A) : const Color(0xFFD97706))),
                ),
              ]),
            );
          },
        ),
      ),
    );
  }
}
