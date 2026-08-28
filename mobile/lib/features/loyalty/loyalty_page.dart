import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/loyalty_service.dart';
import '../../widgets/loading_widget.dart';

/// Halaman Loyalty Dashboard — poin balance, tier progress, cara earn.
class LoyaltyPage extends StatefulWidget {
  const LoyaltyPage({super.key});

  @override
  State<LoyaltyPage> createState() => _LoyaltyPageState();
}

class _LoyaltyPageState extends State<LoyaltyPage> {
  final _service = LoyaltyService();
  LoyaltyProfileModel? _profile;
  List<Map<String, dynamic>> _tiers = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final results = await Future.wait([_service.getProfile(), _service.getTiers()]);
      _profile = results[0] as LoyaltyProfileModel;
      _tiers = results[1] as List<Map<String, dynamic>>;
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: Text('Rewards 🏆', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        actions: [
          TextButton(
            onPressed: () => context.push('/loyalty/history'),
            child: Text('Riwayat', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: AppTheme.leaf700)),
          ),
        ],
      ),
      body: _loading
          ? const LoadingWidget()
          : _profile == null
              ? const Center(child: Text('Gagal memuat profil'))
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(20),
                    children: [
                      // Balance card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [AppTheme.leaf700, AppTheme.leaf500]),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Column(
                          children: [
                            Text(_profile!.tierIcon, style: const TextStyle(fontSize: 48)),
                            const SizedBox(height: 8),
                            Text(_profile!.tierLabel, style: GoogleFonts.poppins(color: Colors.white.withValues(alpha: 0.8), fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text('${_profile!.points}', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 36)),
                            Text('poin tersedia', style: GoogleFonts.poppins(color: Colors.white.withValues(alpha: 0.7), fontSize: 13)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Tier progress
                      Text('Level Kamu', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 16)),
                      const SizedBox(height: 12),
                      ..._tiers.map((tier) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: tier['id'] == _profile!.tier ? AppTheme.leaf50 : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: tier['id'] == _profile!.tier ? AppTheme.leaf300 : AppTheme.leaf100),
                        ),
                        child: Row(
                          children: [
                            Text(tier['icon'] ?? '', style: const TextStyle(fontSize: 24)),
                            const SizedBox(width: 12),
                            Expanded(child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(tier['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                                Text('${tier['min_points'] ?? 0}+ poin', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                              ],
                            )),
                            if (tier['id'] == _profile!.tier)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: AppTheme.leaf600, borderRadius: BorderRadius.circular(12)),
                                child: Text('Sekarang', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                              ),
                          ],
                        ),
                      )),

                      const SizedBox(height: 24),

                      // Quick actions
                      Row(
                        children: [
                          Expanded(child: _actionCard('💰', 'Cara Earn Poin', () {})),
                          const SizedBox(width: 12),
                          Expanded(child: _actionCard('🎁', 'Tukar Poin', () => context.push('/loyalty/redeem'))),
                        ],
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _actionCard(String icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 32)),
            const SizedBox(height: 8),
            Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
