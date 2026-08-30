import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../services/admin_service.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminStoresPage extends StatefulWidget {
  const AdminStoresPage({super.key});
  @override
  State<AdminStoresPage> createState() => _AdminStoresPageState();
}

class _AdminStoresPageState extends State<AdminStoresPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadStores());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.dark),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        appBar: AppBar(title: Text('🏪 Toko', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700))),
        body: ap.loading
            ? const LoadingWidget()
            : RefreshIndicator(
                onRefresh: () => ap.loadStores(),
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: ap.stores.length,
                  itemBuilder: (context, i) {
                    final s = ap.stores[i];
                    final isActive = s['status'] == 'active';
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white, borderRadius: BorderRadius.circular(16),
                        boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
                      ),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                          Text(s['name'] ?? '', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 14, color: AppTheme.leaf950)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: isActive ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(isActive ? 'Aktif' : 'Pending', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w600, color: isActive ? const Color(0xFF16A34A) : const Color(0xFFD97706))),
                          ),
                        ]),
                        const SizedBox(height: 4),
                        Text('Pemilik: ${s['user']?['name'] ?? ''} · ${s['products_count'] ?? 0} produk', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.leaf400)),
                        if (!isActive)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: ElevatedButton(
                              onPressed: () async { await AdminService().verifyStore(s['id']); if (!mounted) return; ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Toko diverifikasi!'))); ap.loadStores(); }, // ignore: use_build_context_synchronously
                              style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                              child: const Text('✅ Verifikasi'),
                            ),
                          ),
                      ]),
                    );
                  },
                ),
              ),
      ),
    );
  }
}
