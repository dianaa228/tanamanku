import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'seller_provider.dart';
import '../../widgets/loading_widget.dart';

class SellerProductsPage extends StatefulWidget {
  const SellerProductsPage({super.key});
  @override
  State<SellerProductsPage> createState() => _SellerProductsPageState();
}

class _SellerProductsPageState extends State<SellerProductsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<SellerProvider>().loadProducts());
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SellerProvider>();
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.dark),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        appBar: AppBar(
          title: Text('📦 Produk Saya', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700)),
          actions: [IconButton(icon: const Icon(Icons.add_rounded), onPressed: () => context.push('/seller/products/create'))],
        ),
        body: sp.loading
            ? const LoadingWidget()
            : sp.products.isEmpty
                ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                    Container(width: 80, height: 80, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(24)), child: const Center(child: Text('📦', style: TextStyle(fontSize: 36)))),
                    const SizedBox(height: 16),
                    Text('Belum ada produk', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.leaf950)),
                    const SizedBox(height: 8),
                    ElevatedButton.icon(onPressed: () => context.push('/seller/products/create'), icon: const Icon(Icons.add, size: 18), label: const Text('Tambah Produk')),
                  ]))
                : RefreshIndicator(
                    onRefresh: () => sp.loadProducts(),
                    child: ListView.builder(
                      padding: const EdgeInsets.all(20),
                      itemCount: sp.products.length,
                      itemBuilder: (context, i) {
                        final p = sp.products[i];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white, borderRadius: BorderRadius.circular(16),
                            boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
                          ),
                          child: Row(children: [
                            Container(width: 56, height: 56, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(14)), child: Center(child: Text(p['category']?['icon'] ?? '🪴', style: const TextStyle(fontSize: 28)))),
                            const SizedBox(width: 14),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(p['name'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.leaf950)),
                              const SizedBox(height: 4),
                              Text(AppFormatter.rupiah(p['price'] ?? 0), style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                              Text('Stok: ${p['stock'] ?? 0}', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.leaf400)),
                            ])),
                            PopupMenuButton(
                              itemBuilder: (_) => [const PopupMenuItem(value: 'edit', child: Text('✏️ Edit')), const PopupMenuItem(value: 'delete', child: Text('🗑️ Hapus'))],
                              onSelected: (v) { if (v == 'edit') context.push('/seller/products/${p['id']}/edit'); },
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
