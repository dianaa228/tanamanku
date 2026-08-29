import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminAnalyticsPage extends StatefulWidget {
  const AdminAnalyticsPage({super.key});
  @override
  State<AdminAnalyticsPage> createState() => _AdminAnalyticsPageState();
}

class _AdminAnalyticsPageState extends State<AdminAnalyticsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadAnalytics());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    if (ap.loading && ap.analytics == null) return const Scaffold(body: LoadingWidget(label: 'Memuat analytics...'));
    if (ap.analytics == null) return const Scaffold(body: Center(child: Text('Gagal memuat data')));

    final overview = ap.analytics!['overview'] ?? {};
    final topSellers = (ap.analytics!['topSellers'] as List?) ?? [];

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('📊 Analytics')),
      body: RefreshIndicator(
        onRefresh: () => ap.loadAnalytics(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Ringkasan', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            Row(children: [
              _stat('💰', 'Revenue', AppFormatter.rupiah(overview['totalRevenue'] ?? 0)), const SizedBox(width: 10),
              _stat('📦', 'Pesanan', '${overview['totalOrders'] ?? 0}'),
            ]),
            const SizedBox(height: 24),
            if (topSellers.isNotEmpty) ...[
              Text('🏆 Top Sellers', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              ...topSellers.map((s) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                child: Row(children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(s['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                    Text('${s['orders'] ?? 0} pesanan', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                  ])),
                  Text(AppFormatter.rupiah(s['revenue'] ?? 0), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                ]),
              )),
            ],
          ]),
        ),
      ),
    );
  }

  Widget _stat(String icon, String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(icon, style: const TextStyle(fontSize: 20)), const SizedBox(height: 4),
          Text(value, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text(label, style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5))),
        ]),
      ),
    );
  }
}
