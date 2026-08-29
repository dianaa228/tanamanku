import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'subscription_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/app_button.dart';

class SubscriptionPage extends StatefulWidget {
  const SubscriptionPage({super.key});
  @override
  State<SubscriptionPage> createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends State<SubscriptionPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final sp = context.read<SubscriptionProvider>();
      sp.loadPlans();
      sp.loadCurrentPlan();
    });
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SubscriptionProvider>();
    if (sp.loading && sp.plans.isEmpty) return const Scaffold(body: LoadingWidget(label: 'Memuat paket langganan...'));

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('⭐ Langganan')),
      body: RefreshIndicator(
        onRefresh: () async { sp.loadPlans(); sp.loadCurrentPlan(); },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Pilih Paket', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Text('Tingkatkan pengalaman berkebunmu.', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
            const SizedBox(height: 20),

            ...sp.plans.map((plan) {
              final price = plan['price'] ?? 0;
              final features = (plan['features'] as List?) ?? [];
              final isPopular = plan['popular'] == true;
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: isPopular ? AppTheme.leaf600 : AppTheme.leaf100, width: isPopular ? 2 : 1),
                  boxShadow: isPopular ? [BoxShadow(color: AppTheme.leaf600.withValues(alpha: 0.1), blurRadius: 16)] : null,
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  if (isPopular)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: AppTheme.leaf600, borderRadius: BorderRadius.circular(12)),
                      child: Text('🔥 Populer', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                  const SizedBox(height: 12),
                  Text('${plan['badge'] ?? ''} ${plan['name'] ?? ''}', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 4),
                  Text(plan['description'] ?? '', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                  const SizedBox(height: 12),
                  price == 0
                      ? Text('Gratis', style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800, color: AppTheme.leaf950))
                      : Text('${AppFormatter.rupiah(price)}/bulan', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.leaf700)),
                  const SizedBox(height: 16),
                  ...features.take(6).map((f) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(children: [
                      Text(f['included'] == true ? '✓ ' : '✗ ', style: TextStyle(color: f['included'] == true ? AppTheme.leaf600 : Colors.grey, fontWeight: FontWeight.w700)),
                      Expanded(child: Text(f['text'] ?? '', style: GoogleFonts.poppins(fontSize: 12, color: f['included'] == true ? AppTheme.leaf900 : AppTheme.leaf400))),
                    ]),
                  )),
                  const SizedBox(height: 16),
                  AppButton(
                    label: price == 0 ? 'Paket Saat Ini' : 'Berlangganan',
                    expanded: true, onPressed: price == 0 ? null : () {},
                  ),
                ]),
              );
            }),
          ]),
        ),
      ),
    );
  }
}
