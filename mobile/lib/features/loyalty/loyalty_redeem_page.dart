import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/loyalty_service.dart';
import '../../widgets/loading_widget.dart';

/// Halaman Tukar Poin — browse & redeem rewards.
class LoyaltyRedeemPage extends StatefulWidget {
  const LoyaltyRedeemPage({super.key});

  @override
  State<LoyaltyRedeemPage> createState() => _LoyaltyRedeemPageState();
}

class _LoyaltyRedeemPageState extends State<LoyaltyRedeemPage> {
  final _service = LoyaltyService();
  List<LoyaltyRewardModel> _rewards = [];
  LoyaltyProfileModel? _profile;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final results = await Future.wait([_service.getRewards(), _service.getProfile()]);
      _rewards = results[0] as List<LoyaltyRewardModel>;
      _profile = results[1] as LoyaltyProfileModel;
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text('Tukar Poin 🎁', style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
      body: _loading
          ? const LoadingWidget()
          : _rewards.isEmpty
              ? Center(child: Text('Belum ada reward tersedia', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.5))))
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: _rewards.length,
                    itemBuilder: (context, i) {
                      final r = _rewards[i];
                      final canRedeem = (_profile?.points ?? 0) >= r.pointsCost;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
                        child: Row(
                          children: [
                            Container(
                              width: 48, height: 48,
                              decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(12)),
                              child: Center(child: Text(r.typeIcon, style: const TextStyle(fontSize: 24))),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(r.name, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                                  if (r.description != null)
                                    Text(r.description!, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)), maxLines: 1, overflow: TextOverflow.ellipsis),
                                  const SizedBox(height: 4),
                                  Text('${r.pointsCost} poin', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 12, color: AppTheme.leaf600)),
                                ],
                              ),
                            ),
                            ElevatedButton(
                              onPressed: canRedeem ? () async {
                                await _service.redeemReward(r.id);
                                _load();
                                if (!context.mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Berhasil menukar ${r.name}! 🎉')));
                              } : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: canRedeem ? AppTheme.leaf600 : AppTheme.leaf200,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              child: Text('Tukar', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 12, color: canRedeem ? Colors.white : AppTheme.leaf400)),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
