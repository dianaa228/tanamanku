import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'subscription_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/app_button.dart';

class SubscriptionManagePage extends StatefulWidget {
  const SubscriptionManagePage({super.key});
  @override
  State<SubscriptionManagePage> createState() => _SubscriptionManagePageState();
}

class _SubscriptionManagePageState extends State<SubscriptionManagePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final sp = context.read<SubscriptionProvider>();
      sp.loadCurrentPlan();
      sp.loadBillingHistory();
    });
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SubscriptionProvider>();
    final plan = sp.currentPlan;
    final isPremium = plan != null && plan['plan_id'] != 'free';

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('⭐ Kelola Langganan')),
      body: sp.loading
          ? const LoadingWidget()
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                // Current plan
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: isPremium ? [AppTheme.leaf500, AppTheme.leaf700] : [Colors.grey.shade400, Colors.grey.shade600]),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(isPremium ? 'Paket Aktif' : 'Paket Gratis', style: GoogleFonts.poppins(fontSize: 12, color: Colors.white70)),
                    const SizedBox(height: 4),
                    Text(plan?['plan_id'] ?? 'free', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                    if (plan?['expires_at'] != null)
                      Text('Berakhir: ${plan!['expires_at']}', style: GoogleFonts.poppins(fontSize: 12, color: Colors.white60)),
                  ]),
                ),
                const SizedBox(height: 24),
                if (isPremium) ...[
                  AppButton.danger(label: 'Batalkan Langganan', expanded: true, onPressed: () async {
                    final confirm = await showDialog<bool>(context: context, builder: (_) => AlertDialog(
                      title: const Text('Batalkan?'),
                      content: const Text('Langganan akan berakhir di akhir periode.'),
                      actions: [TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Tidak')), TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Ya, Batalkan'))],
                    ));
                    if (confirm == true) { sp.cancel(); if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Langganan dibatalkan'))); }
                  }),
                ],
                const SizedBox(height: 24),
                Text('Riwayat Pembayaran', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                const SizedBox(height: 12),
                if (sp.billingHistory.isEmpty)
                  Center(child: Text('Belum ada riwayat', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.5))))
                else
                  ...sp.billingHistory.map((b) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(b['description'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                        Text(b['date'] ?? '', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                      ]),
                      Text(AppFormatter.rupiah(b['amount'] ?? 0), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                    ]),
                  )),
              ]),
            ),
    );
  }
}
