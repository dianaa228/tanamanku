import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../services/cart_service.dart';
import '../../models/cart_model.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/app_button.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final _service = CartService();
  CartModel? _cart;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadCart();
  }

  Future<void> _loadCart() async {
    try {
      final cart = await _service.fetchCart();
      if (mounted) setState(() { _cart = cart; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _updateQty(int itemId, int qty) async {
    if (qty < 1) return _removeItem(itemId);
    try {
      await _service.updateItem(itemId, qty);
      _loadCart();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal update: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _removeItem(int itemId) async {
    try {
      await _service.removeItem(itemId);
      _loadCart();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Item dihapus')));
    } catch (_) {}
  }

  Future<void> _clearCart() async {
    try {
      await _service.clear();
      _loadCart();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Keranjang dikosongkan')));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: const Text('Keranjang 🛒'),
        actions: [
          if (_cart != null && _cart!.items.isNotEmpty)
            TextButton(
              onPressed: _clearCart,
              child: Text('Kosongkan', style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFFEF4444))),
            ),
        ],
      ),
      body: _loading
          ? const LoadingWidget()
          : _cart == null || _cart!.items.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🛒', style: TextStyle(fontSize: 64)),
                      const SizedBox(height: 16),
                      Text('Keranjangmu kosong', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      AppButton(label: 'Mulai belanja', onPressed: () => context.push('/explore')),
                    ],
                  ),
                )
              : Column(
                  children: [
                    // ── Item list ──
                    Expanded(
                      child: RefreshIndicator(
                        onRefresh: _loadCart,
                        child: ListView.separated(
                          padding: const EdgeInsets.all(20),
                          itemCount: _cart!.items.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, i) {
                            final item = _cart!.items[i];
                            return Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: AppTheme.leaf100),
                              ),
                              child: Row(
                                children: [
                                  // Produk info
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.productName,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600),
                                        ),
                                        if (item.variantName != null) ...[
                                          const SizedBox(height: 2),
                                          Text(
                                            'Varian: ${item.variantName}',
                                            style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)),
                                          ),
                                        ],
                                        const SizedBox(height: 8),
                                        Row(
                                          children: [
                                            // Qty control
                                            Container(
                                              decoration: BoxDecoration(
                                                color: AppTheme.leaf50,
                                                borderRadius: BorderRadius.circular(10),
                                              ),
                                              child: Row(
                                                children: [
                                                  IconButton(
                                                    icon: const Icon(Icons.remove, size: 16),
                                                    onPressed: () => _updateQty(item.id, item.quantity - 1),
                                                    constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                                  ),
                                                  Text('${item.quantity}', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                                                  IconButton(
                                                    icon: const Icon(Icons.add, size: 16),
                                                    onPressed: () => _updateQty(item.id, item.quantity + 1),
                                                    constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),

                                  // Harga & hapus
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFEF4444)),
                                        onPressed: () => _removeItem(item.id),
                                        constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                                      ),
                                      Text(
                                        AppFormatter.rupiah(item.total),
                                        style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.leaf700),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ),

                    // ── Ringkasan + Checkout ──
                    Container(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.05), blurRadius: 16, offset: const Offset(0, -4)),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Subtotal (${_cart!.itemCount} item)', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                              Text(AppFormatter.rupiah(_cart!.subtotal), style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Ongkir (estimasi)', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                              Text(AppFormatter.rupiah(15000), style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                            ],
                          ),
                          const Divider(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Total', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                              Text(
                                AppFormatter.rupiah(_cart!.subtotal + 15000),
                                style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.leaf700),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          AppButton(
                            label: 'Lanjut checkout →',
                            expanded: true,
                            onPressed: () => context.push('/checkout'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }
}
