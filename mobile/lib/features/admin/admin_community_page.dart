import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../services/admin_service.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminCommunityPage extends StatefulWidget {
  const AdminCommunityPage({super.key});
  @override
  State<AdminCommunityPage> createState() => _AdminCommunityPageState();
}

class _AdminCommunityPageState extends State<AdminCommunityPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadReports());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('💬 Komunitas')),
      body: ap.loading ? const LoadingWidget() : RefreshIndicator(
        onRefresh: () => ap.loadReports(),
        child: ap.reports.isEmpty
            ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text('✅', style: TextStyle(fontSize: 48)),
                const SizedBox(height: 12),
                Text('Tidak ada laporan', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600)),
              ]))
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: ap.reports.length,
                itemBuilder: (context, i) {
                  final r = ap.reports[i];
                  final isOpen = r['status'] == 'open';
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        Text('Laporan dari ${r['reporter']?['name'] ?? ''}', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: isOpen ? const Color(0xFFFEF3C7) : const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(8)),
                          child: Text(isOpen ? 'Open' : 'Resolved', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: isOpen ? const Color(0xFFD97706) : const Color(0xFF16A34A))),
                        ),
                      ]),
                      const SizedBox(height: 4),
                      Text('Alasan: ${r['reason'] ?? ''}', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                      if (isOpen)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: ElevatedButton(
                            onPressed: () async { await AdminService().resolveReport(r['id']); ap.loadReports(); },
                            child: const Text('✅ Selesaikan'),
                          ),
                        ),
                    ]),
                  );
                },
              ),
      ),
    );
  }
}
