import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_theme.dart';
import '../core/utils/app_formatter.dart';
import '../models/product_model.dart';

/// Kartu produk — dipakai di grid marketplace.
class ProductCard extends StatelessWidget {
  final ProductModel product;
  final bool compact;

  const ProductCard({super.key, required this.product, this.compact = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/product/${product.slug}'),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.leaf100),
          boxShadow: [
            BoxShadow(
              color: AppTheme.leaf900.withOpacity(0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Gambar produk
            Container(
              height: compact ? 120 : 140,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                gradient: _productGradient(),
              ),
              child: Center(
                child: Text(
                  _productEmoji(),
                  style: TextStyle(fontSize: compact ? 40 : 48),
                ),
              ),
            ),

            // Info produk
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.leaf950,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Rating & terjual
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, size: 14, color: AppTheme.sun500),
                      const SizedBox(width: 2),
                      Text(
                        product.ratingAvg.toStringAsFixed(1),
                        style: GoogleFonts.poppins(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.leaf900,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${product.soldCount} terjual',
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          color: AppTheme.leaf900.withOpacity(0.4),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 6),

                  // Harga
                  Text(
                    AppFormatter.rupiah(product.price),
                    style: GoogleFonts.poppins(
                      fontSize: compact ? 13 : 14,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.leaf700,
                    ),
                  ),

                  // Stok rendah
                  if (product.stock <= 5) ...[
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '⚠️ Sisa ${product.stock}',
                        style: GoogleFonts.poppins(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFFDC2626),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  LinearGradient _productGradient() {
    final name = product.name.toLowerCase();
    if (name.contains('monstera')) return const LinearGradient(colors: [Color(0xFF4ADE80), Color(0xFF059669)]);
    if (name.contains('sirih') || name.contains('pothos')) return const LinearGradient(colors: [Color(0xFFBEF264), Color(0xFF16A34A)]);
    if (name.contains('aglonema')) return const LinearGradient(colors: [Color(0xFFFDA4AF), Color(0xFFE11D48)]);
    if (name.contains('lidah mertua') || name.contains('sansevieria')) return const LinearGradient(colors: [Color(0xFF34D399), Color(0xFF0D9488)]);
    if (name.contains('cabai') || name.contains('chili')) return const LinearGradient(colors: [Color(0xFFEF4444), Color(0xFFBE123C)]);
    if (name.contains('tomat') || name.contains('tomato')) return const LinearGradient(colors: [Color(0xFFFB923C), Color(0xFFDC2626)]);
    if (name.contains('kemangi') || name.contains('basil')) return const LinearGradient(colors: [Color(0xFFA3E635), Color(0xFF16A34A)]);
    if (name.contains('pupuk') || name.contains('npk') || name.contains('nutrisi')) return const LinearGradient(colors: [Color(0xFF7DD3FC), Color(0xFF2563EB)]);
    if (name.contains('pot') || name.contains('terakota')) return const LinearGradient(colors: [Color(0xFFFDBA74), Color(0xFF92400E)]);
    return const LinearGradient(colors: [Color(0xFFBBF7D0), Color(0xFF15803D)]);
  }

  String _productEmoji() {
    final name = product.name.toLowerCase();
    if (name.contains('monstera')) return '🌿';
    if (name.contains('sirih') || name.contains('pothos')) return '🍃';
    if (name.contains('aglonema')) return '🪴';
    if (name.contains('lidah mertua') || name.contains('sansevieria')) return '🌵';
    if (name.contains('cabai') || name.contains('chili')) return '🌶️';
    if (name.contains('tomat') || name.contains('tomato')) return '🍅';
    if (name.contains('kemangi') || name.contains('basil')) return '🌿';
    if (name.contains('pupuk') || name.contains('npk') || name.contains('nutrisi')) return '🧪';
    if (name.contains('cocopeat')) return '🥥';
    if (name.contains('humus') || name.contains('tanah')) return '🪨';
    if (name.contains('sprayer')) return '🚿';
    if (name.contains('pot') || name.contains('terakota')) return '🏺';
    if (name.contains('rotan') || name.contains('gantung')) return '🧺';
    if (name.contains('set hidroponik') || name.contains('hidroponik') && name.contains('set')) return '🌱';
    if (name.contains('hidroponik') || name.contains('pakcoy')) return '🥬';
    if (name.contains('aloe') || name.contains('lidah buaya')) return '🌵';
    return '🌿';
  }
}
