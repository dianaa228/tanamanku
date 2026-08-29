import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'marketplace_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/product_card.dart';

class ExplorePage extends StatefulWidget {
  final String? initialCategory;
  const ExplorePage({super.key, this.initialCategory});

  @override
  State<ExplorePage> createState() => _ExplorePageState();
}

class _ExplorePageState extends State<ExplorePage> {
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final mp = context.read<MarketplaceProvider>();
      if (widget.initialCategory != null) {
        mp.setCategory(widget.initialCategory!);
      } else if (mp.products.isEmpty && !mp.loading) {
        mp.loadProducts();
      }
    });
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mp = context.watch<MarketplaceProvider>();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: SafeArea(
        child: Column(
          children: [
            // ── Header + Search ──
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Jelajahi Katalog 🌿',
                    style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w800, color: AppTheme.leaf950),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    mp.loading ? 'Mencari...' : '${mp.products.length} produk ditemukan',
                    style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5)),
                  ),
                  const SizedBox(height: 12),

                  // Search bar
                  TextField(
                    controller: _searchCtrl,
                    onSubmitted: (v) => mp.setSearch(v),
                    decoration: InputDecoration(
                      hintText: 'Cari tanaman, pupuk, pot...',
                      prefixIcon: const Icon(Icons.search_rounded, size: 20),
                      suffixIcon: _searchCtrl.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.close, size: 18),
                              onPressed: () {
                                _searchCtrl.clear();
                                mp.resetFilters();
                              },
                            )
                          : null,
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Sort chips
                  SizedBox(
                    height: 36,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _sortOptions.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, i) {
                        final opt = _sortOptions[i];
                        final selected = mp.selectedSort == opt['value'];
                        return FilterChip(
                          label: Text(opt['label']!, style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
                          selected: selected,
                          onSelected: (_) => mp.setSort(opt['value']!),
                          selectedColor: AppTheme.leaf600,
                          labelStyle: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: selected ? Colors.white : AppTheme.leaf900,
                          ),
                          checkmarkColor: Colors.white,
                          side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // ── Kategori horizontal ──
            SizedBox(
              height: 42,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: mp.categories.length + 1,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  if (i == 0) {
                    final selected = mp.selectedCategory.isEmpty;
                    return FilterChip(
                      label: Text('Semua', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
                      selected: selected,
                      onSelected: (_) => mp.setCategory(''),
                      selectedColor: AppTheme.leaf600,
                      labelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
                      checkmarkColor: Colors.white,
                      side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    );
                  }
                  final cat = mp.categories[i - 1];
                  final selected = mp.selectedCategory == cat.slug;
                  return FilterChip(
                    avatar: Text(cat.icon ?? '🪴', style: const TextStyle(fontSize: 14)),
                    label: Text(cat.name, style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
                    selected: selected,
                    onSelected: (_) => mp.setCategory(selected ? '' : cat.slug),
                    selectedColor: AppTheme.leaf600,
                    labelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
                    checkmarkColor: Colors.white,
                    side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  );
                },
              ),
            ),

            const SizedBox(height: 12),

            // ── Produk grid ──
            Expanded(
              child: mp.loading
                  ? const LoadingWidget(label: 'Menyiapkan produk terbaik...')
                  : mp.products.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text('🔍', style: TextStyle(fontSize: 48)),
                              const SizedBox(height: 12),
                              Text(
                                'Produk tidak ditemukan',
                                style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.leaf900),
                              ),
                              const SizedBox(height: 8),
                              TextButton(
                                onPressed: () {
                                  _searchCtrl.clear();
                                  mp.resetFilters();
                                },
                                child: Text('Reset filter', style: GoogleFonts.poppins(color: AppTheme.leaf700)),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => mp.loadProducts(),
                          child: GridView.builder(
                            padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              childAspectRatio: 0.62,
                            ),
                            itemCount: mp.products.length,
                            itemBuilder: (context, i) => ProductCard(product: mp.products[i]),
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  static const _sortOptions = [
    {'value': 'relevansi', 'label': 'Paling relevan'},
    {'value': 'terlaris', 'label': 'Terlaris'},
    {'value': 'harga-asc', 'label': 'Harga terendah'},
    {'value': 'harga-desc', 'label': 'Harga tertinggi'},
    {'value': 'rating', 'label': 'Rating tertinggi'},
  ];
}
