import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.dark),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        body: SafeArea(
          child: Column(
            children: [
              // ── Header + Search ──
              Container(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 12, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Jelajahi Katalog 🌿',
                      style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w800, color: AppTheme.leaf950),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      mp.loading ? 'Mencari...' : '${mp.products.length} produk ditemukan',
                      style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.leaf400),
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
                                onPressed: () { _searchCtrl.clear(); mp.resetFilters(); },
                              )
                            : null,
                        filled: true,
                        fillColor: AppTheme.leaf50.withValues(alpha: 0.5),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: AppTheme.leaf200)),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: AppTheme.leaf200)),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppTheme.leaf500, width: 2)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                            label: Text(opt['label']!, style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600)),
                            selected: selected,
                            onSelected: (_) => mp.setSort(opt['value']!),
                            selectedColor: AppTheme.leaf600,
                            labelStyle: GoogleFonts.plusJakartaSans(
                              fontSize: 11, fontWeight: FontWeight.w600,
                              color: selected ? Colors.white : AppTheme.leaf900,
                            ),
                            checkmarkColor: Colors.white,
                            side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
                height: 44,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                  children: [
                    _categoryChip('Semua', '', mp.selectedCategory.isEmpty, mp),
                    ...mp.categories.map((c) => _categoryChip(c.name, c.slug, mp.selectedCategory == c.slug, mp, icon: c.icon)),
                  ],
                ),
              ),

              const SizedBox(height: 8),

              // ── Produk grid ──
              Expanded(
                child: mp.loading
                    ? const LoadingWidget(label: 'Menyiapkan produk terbaik...')
                    : mp.products.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 80, height: 80,
                                  decoration: BoxDecoration(
                                    color: AppTheme.leaf100,
                                    borderRadius: BorderRadius.circular(24),
                                  ),
                                  child: const Center(child: Text('🔍', style: TextStyle(fontSize: 36))),
                                ),
                                const SizedBox(height: 16),
                                Text('Produk tidak ditemukan', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.leaf950)),
                                const SizedBox(height: 8),
                                TextButton(onPressed: () { _searchCtrl.clear(); mp.resetFilters(); }, child: const Text('Reset filter')),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: () => mp.loadProducts(),
                            child: GridView.builder(
                              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.62,
                              ),
                              itemCount: mp.products.length,
                              itemBuilder: (context, i) => ProductCard(product: mp.products[i]),
                            ),
                          ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _categoryChip(String label, String slug, bool selected, MarketplaceProvider mp, {String? icon}) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        avatar: icon != null ? Text(icon, style: const TextStyle(fontSize: 14)) : null,
        label: Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600)),
        selected: selected,
        onSelected: (_) => mp.setCategory(selected ? '' : slug),
        selectedColor: AppTheme.leaf600,
        labelStyle: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
        checkmarkColor: Colors.white,
        side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(horizontal: 4),
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
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
