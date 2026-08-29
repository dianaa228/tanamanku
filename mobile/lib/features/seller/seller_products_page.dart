import 'package:flutter/material.dart';
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
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: const Text('📦 Produk Saya'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: () => context.push('/seller/products/create'),
          ),
        ],
      ),
      body: sp.loading
          ? const LoadingWidget()
          : sp.products.isEmpty
              ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Text('📦', style: TextStyle(fontSize: 56)),
                  const SizedBox(height: 12),
                  Text('Belum ada produk', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
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
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
                        child: Row(
                          children: [
                            Container(width: 56, height: 56, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(14)), child: Center(child: Text(p['category']?['icon'] ?? '🪴', style: const TextStyle(fontSize: 28)))),
                            const SizedBox(width: 14),
                            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              Text(p['name'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                              const SizedBox(height: 4),
                              Text(AppFormatter.rupiah(p['price'] ?? 0), style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                              Text('Stok: ${p['stock'] ?? 0}', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                            ])),
                            PopupMenuButton(
                              itemBuilder: (_) => [
                                const PopupMenuItem(value: 'edit', child: Text('✏️ Edit')),
                                const PopupMenuItem(value: 'delete', child: Text('🗑️ Hapus')),
                              ],
                              onSelected: (v) {
                                if (v == 'edit') context.push('/seller/products/${p['id']}/edit');
                              },
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
