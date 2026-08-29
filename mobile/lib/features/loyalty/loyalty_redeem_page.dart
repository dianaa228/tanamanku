import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'loyalty_provider.dart';
import '../../widgets/loading_widget.dart';

class LoyaltyRedeemPage extends StatefulWidget {
  const LoyaltyRedeemPage({super.key});

  @override
  State<LoyaltyRedeemPage> createState() => _LoyaltyRedeemPageState();
}

class _LoyaltyRedeemPageState extends State<LoyaltyRedeemPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final loyalty = context.read<LoyaltyProvider>();
      loyalty.loadRewards();
      loyalty.loadProfile();
    });
  }

  @override
  Widget build(BuildContext context) {
    final loyalty = context.watch<LoyaltyProvider>();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text('Tukar Poin 🎁', style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
      body: loyalty.loading
          ? const LoadingWidget()
          : loyalty.rewards.isEmpty
              ? Center(child: Text('Belum ada reward tersedia', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.5))))
              : Column(children: [
                  // Poin balance
                  if (loyalty.profile != null)
                    Container(width: double.infinity, margin: const EdgeInsets.all(20), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: const LinearGradient(colors: [AppTheme.leaf700, AppTheme.leaf500]), borderRadius: BorderRadius.circular(16)),
                      child: Row(children: [
                        Text(loyalty.profile!.tierIcon, style: const TextStyle(fontSize: 32)),
                        const SizedBox(width: 12),
                        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text('${loyalty.points} poin', style: GoogleFonts.poppins(fontWeight: FontWeight.w800, fontSize: 20, color: Colors.white)),
                          Text('Tersedia untuk ditukar', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withValues(alpha: 0.7))),
                        ]),
                      ])),
                  // Rewards list
                  Expanded(child: ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 20), itemCount: loyalty.rewards.length,
                    itemBuilder: (context, i) {
                      final r = loyalty.rewards[i];
                      final canRedeem = loyalty.points >= r.pointsCost;
                      return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: canRedeem ? AppTheme.leaf200 : AppTheme.leaf100)),
                        child: Row(children: [
                          Container(width: 48, height: 48, decoration: BoxDecoration(color: canRedeem ? AppTheme.leaf50 : AppTheme.leaf50.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(14)),
                            child: Center(child: Text(r.typeIcon, style: const TextStyle(fontSize: 24)))),
                          const SizedBox(width: 14),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(r.name, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                            if (r.description != null) Text(r.description!, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)), maxLines: 1, overflow: TextOverflow.ellipsis),
                            const SizedBox(height: 4),
                            Text('${r.pointsCost} poin', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13, color: canRedeem ? AppTheme.leaf700 : AppTheme.leaf900.withValues(alpha: 0.4))),
                          ])),
                          if (canRedeem)
                            ElevatedButton(onPressed: () async {
                              final success = await loyalty.redeemReward(r.id);
                              if (success && mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${r.name} berhasil ditukar! 🎉')));
                            }, style: ElevatedButton.styleFrom(backgroundColor: AppTheme.leaf600, padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8)),
                              child: Text('Tukar', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white)))
                          else
                            Text('Kurang ${r.pointsCost - loyalty.points}', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.4))),
                        ]));
                    })),
                ]),
    );
  }
}
