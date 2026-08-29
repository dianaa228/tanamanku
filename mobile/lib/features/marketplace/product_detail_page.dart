import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../marketplace/marketplace_provider.dart';
import '../cart/cart_provider.dart';
import '../../widgets/loading_widget.dart';

class ProductDetailPage extends StatefulWidget {
  final String slug;
  const ProductDetailPage({super.key, required this.slug});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  int _qty = 1;
  int _selectedVariant = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MarketplaceProvider>().loadProduct(widget.slug);
    });
  }

  Future<void> _addToCart(MarketplaceProvider mp, CartProvider cart, bool buyNow) async {
    final p = mp.currentProduct;
    if (p == null) return;
    final variantId = p.variants.isNotEmpty ? p.variants[_selectedVariant].id : null;
    final success = await cart.addItem(productId: p.id, quantity: _qty, variantId: variantId);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${p.name} ditambahkan ke keranjang 🛒')),
      );
      if (buyNow) context.push('/checkout');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(cart.error ?? 'Gagal menambahkan'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final mp = context.watch<MarketplaceProvider>();
    final cart = context.watch<CartProvider>();

    if (mp.loading) return const Scaffold(body: LoadingWidget());
    final p = mp.currentProduct;
    if (p == null) return const Scaffold(body: Center(child: Text('Produk tidak ditemukan')));

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppTheme.leaf100,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppTheme.leaf200, AppTheme.leaf100],
                  ),
                ),
                child: Center(child: Text(_productEmoji(p.name), style: const TextStyle(fontSize: 80))),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 6,
                    children: [
                      _tag('🏷️ ${p.careLevel.toUpperCase()}', AppTheme.leaf100, AppTheme.leaf700),
                      if (p.store != null) _tag('🏪 ${p.store!.name}', AppTheme.leaf50, AppTheme.leaf700),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(p.name, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.leaf950, height: 1.2)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, size: 18, color: AppTheme.sun500),
                      const SizedBox(width: 4),
                      Text('${p.ratingAvg.toStringAsFixed(1)} (${p.soldCount} terjual)', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(16)),
                    child: Text(AppFormatter.rupiah(p.price), style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w800, color: AppTheme.leaf700)),
                  ),
                  if (p.variants.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    Text('Pilih varian', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: List.generate(p.variants.length, (i) {
                        final selected = _selectedVariant == i;
                        return ChoiceChip(
                          label: Text(p.variants[i].name),
                          selected: selected,
                          onSelected: (_) => setState(() => _selectedVariant = i),
                          selectedColor: AppTheme.leaf600,
                          labelStyle: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
                          side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        );
                      }),
                    ),
                  ],
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Text('Jumlah', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                      const Spacer(),
                      Container(
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf200)),
                        child: Row(
                          children: [
                            IconButton(icon: const Icon(Icons.remove, size: 18), onPressed: _qty > 1 ? () => setState(() => _qty--) : null),
                            Text('$_qty', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                            IconButton(icon: const Icon(Icons.add, size: 18), onPressed: _qty < p.stock ? () => setState(() => _qty++) : null),
                          ],
                        ),
                      ),
                    ],
                  ),
                  if (p.stock <= 5) ...[
                    const SizedBox(height: 8),
                    Text('⚠️ Sisa ${p.stock} — buruan!', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFFDC2626))),
                  ],
                  const SizedBox(height: 24),
                  Text('Deskripsi', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Text(p.description ?? '—', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.7), height: 1.6)),
                  const SizedBox(height: 120),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, -4))],
        ),
        child: Row(
          children: [
            Expanded(child: OutlinedButton.icon(onPressed: () => _addToCart(mp, cart, false), icon: const Icon(Icons.shopping_cart_outlined, size: 18), label: const Text('Keranjang'))),
            const SizedBox(width: 12),
            Expanded(child: ElevatedButton.icon(onPressed: () => _addToCart(mp, cart, true), icon: const Icon(Icons.flash_on_rounded, size: 18), label: const Text('Beli sekarang'))),
          ],
        ),
      ),
    );
  }

  Widget _tag(String text, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Text(text, style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: fg)),
    );
  }

  String _productEmoji(String name) {
    final n = name.toLowerCase();
    if (n.contains('monstera')) return '🌿';
    if (n.contains('sirih') || n.contains('pothos')) return '🍃';
    if (n.contains('aglonema')) return '🪴';
    if (n.contains('lidah mertua')) return '🌵';
    if (n.contains('cabai')) return '🌶️';
    if (n.contains('tomat')) return '🍅';
    if (n.contains('kemangi')) return '🌿';
    if (n.contains('pupuk') || n.contains('nutrisi')) return '🧪';
    if (n.contains('pot')) return '🏺';
    if (n.contains('sprayer')) return '🚿';
    return '🌿';
  }
}
