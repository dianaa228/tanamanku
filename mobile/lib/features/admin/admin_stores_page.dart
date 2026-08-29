import 'package:flutter/material.dart';
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
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('🏪 Toko')),
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
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                        Text(s['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: isActive ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(8)),
                          child: Text(isActive ? 'Aktif' : 'Pending', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: isActive ? const Color(0xFF16A34A) : const Color(0xFFD97706))),
                        ),
                      ]),
                      const SizedBox(height: 4),
                      Text('Pemilik: ${s['user']?['name'] ?? ''} · ${s['products_count'] ?? 0} produk', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                      if (!isActive)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: ElevatedButton(
                            onPressed: () async {
                              await AdminService().verifyStore(s['id']);
                              ap.loadStores();
                              if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Toko diverifikasi!')));
                            },
                            child: const Text('✅ Verifikasi'),
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
