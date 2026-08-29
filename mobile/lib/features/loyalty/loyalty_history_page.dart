import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'loyalty_provider.dart';
import '../../widgets/loading_widget.dart';

class LoyaltyHistoryPage extends StatefulWidget {
  const LoyaltyHistoryPage({super.key});

  @override
  State<LoyaltyHistoryPage> createState() => _LoyaltyHistoryPageState();
}

class _LoyaltyHistoryPageState extends State<LoyaltyHistoryPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LoyaltyProvider>().loadHistory();
    });
  }

  @override
  Widget build(BuildContext context) {
    final loyalty = context.watch<LoyaltyProvider>();
    final totalEarn = loyalty.history.where((t) => t.isEarn).fold(0, (sum, t) => sum + t.points);
    final totalRedeem = loyalty.history.where((t) => !t.isEarn).fold(0, (sum, t) => sum + t.points);

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text('Riwayat Poin 📊', style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
      body: loyalty.loading
          ? const LoadingWidget()
          : Column(children: [
              Padding(padding: const EdgeInsets.all(20), child: Row(children: [
                _summaryCard('💰', 'Earn', '+$totalEarn', AppTheme.leaf600),
                const SizedBox(width: 12),
                _summaryCard('🎁', 'Redeem', '-$totalRedeem', const Color(0xFFEF4444)),
                const SizedBox(width: 12),
                _summaryCard('📊', 'Selisih', '${totalEarn - totalRedeem}', AppTheme.leaf700),
              ])),
              Expanded(child: loyalty.history.isEmpty
                  ? Center(child: Text('Belum ada riwayat', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.5))))
                  : ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 20), itemCount: loyalty.history.length,
                      itemBuilder: (context, i) {
                        final t = loyalty.history[i];
                        return Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                          child: Row(children: [
                            Container(width: 36, height: 36, decoration: BoxDecoration(color: t.isEarn ? AppTheme.leaf50 : const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(10)),
                              child: Center(child: Text(t.isEarn ? '📈' : '📉', style: const TextStyle(fontSize: 18)))),
                            const SizedBox(width: 12),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(t.description ?? t.type, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                              if (t.createdAt != null) Text(t.createdAt!.substring(0, 10), style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.4))),
                            ])),
                            Text('${t.isEarn ? '+' : '-'}${t.points}', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 14, color: t.isEarn ? AppTheme.leaf600 : const Color(0xFFEF4444))),
                          ]));
                      })),
            ]),
    );
  }

  Widget _summaryCard(String icon, String label, String value, Color color) {
    return Expanded(child: Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(14)),
      child: Column(children: [
        Text(icon, style: const TextStyle(fontSize: 20)), const SizedBox(height: 4),
        Text(value, style: GoogleFonts.poppins(fontWeight: FontWeight.w800, fontSize: 18, color: color)),
        Text(label, style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5))),
      ])));
  }
}
