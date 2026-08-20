import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../models/product_model.dart';
import '../../models/category_model.dart';
import '../../services/product_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/product_card.dart';

class ExplorePage extends StatefulWidget {
  final String? initialCategory;
  const ExplorePage({super.key, this.initialCategory});

  @override
  State<ExplorePage> createState() => _ExplorePageState();
}

class _ExplorePageState extends State<ExplorePage> {
  final _service = ProductService();
  final _searchCtrl = TextEditingController();
  List<ProductModel> _products = [];
  List<CategoryModel> _categories = [];
  bool _loading = true;
  String _selectedCategory = '';
  String _selectedSort = 'relevansi';

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory ?? '';
    _loadData();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      final results = await Future.wait([
        _service.getProducts(
          search: _searchCtrl.text,
          category: _selectedCategory,
          sort: _selectedSort,
        ),
        _service.getCategories(),
      ]);
      if (mounted) {
        setState(() {
          _products = results[0];
          _categories = results[1];
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                    _loading ? 'Mencari...' : '${_products.length} produk ditemukan',
                    style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withOpacity(0.5)),
                  ),
                  const SizedBox(height: 12),

                  // Search bar
                  TextField(
                    controller: _searchCtrl,
                    onSubmitted: (_) => _loadData(),
                    decoration: InputDecoration(
                      hintText: 'Cari tanaman, pupuk, pot...',
                      prefixIcon: const Icon(Icons.search_rounded, size: 20),
                      suffixIcon: _searchCtrl.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.close, size: 18),
                              onPressed: () {
                                _searchCtrl.clear();
                                _loadData();
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
                        final selected = _selectedSort == opt['value'];
                        return FilterChip(
                          label: Text(opt['label']!, style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
                          selected: selected,
                          onSelected: (_) {
                            setState(() => _selectedSort = opt['value']!);
                            _loadData();
                          },
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
                itemCount: _categories.length + 1,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  if (i == 0) {
                    final selected = _selectedCategory.isEmpty;
                    return FilterChip(
                      label: Text('Semua', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
                      selected: selected,
                      onSelected: (_) {
                        setState(() => _selectedCategory = '');
                        _loadData();
                      },
                      selectedColor: AppTheme.leaf600,
                      labelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
                      checkmarkColor: Colors.white,
                      side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    );
                  }
                  final cat = _categories[i - 1];
                  final selected = _selectedCategory == cat.slug;
                  return FilterChip(
                    avatar: Text(cat.icon ?? '🪴', style: const TextStyle(fontSize: 14)),
                    label: Text(cat.name, style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600)),
                    selected: selected,
                    onSelected: (_) {
                      setState(() => _selectedCategory = selected ? '' : cat.slug);
                      _loadData();
                    },
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
              child: _loading
                  ? const LoadingWidget(label: 'Menyiapkan produk terbaik...')
                  : _products.isEmpty
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
                                  setState(() {
                                    _selectedCategory = '';
                                    _selectedSort = 'relevansi';
                                  });
                                  _loadData();
                                },
                                child: Text('Reset filter', style: GoogleFonts.poppins(color: AppTheme.leaf700)),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: _loadData,
                          child: GridView.builder(
                            padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              childAspectRatio: 0.62,
                            ),
                            itemCount: _products.length,
                            itemBuilder: (context, i) => ProductCard(product: _products[i]),
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
