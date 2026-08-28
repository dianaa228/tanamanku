import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../models/product_model.dart';
import '../../models/category_model.dart';
import '../../services/product_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/product_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _service = ProductService();
  List<ProductModel> _featured = [];
  List<CategoryModel> _categories = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final featured = await _service.getProducts(sort: 'terlaris', perPage: 8);
      final categories = await _service.getCategories();
      if (mounted) {
        setState(() {
          _featured = featured;
          _categories = categories;
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
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            // ── Hero ──
            SliverToBoxAdapter(child: _buildHero()),

            // ── Kategori ──
            SliverToBoxAdapter(child: _buildCategories()),

            // ── Produk pilihan ──
            SliverToBoxAdapter(child: _buildFeatured()),

            // ── Fitur cerdas ──
            SliverToBoxAdapter(child: _buildSmartFeatures()),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  Widget _buildHero() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 32),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppTheme.leaf100, AppTheme.cream],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.05), blurRadius: 8),
              ],
            ),
            child: Text(
              '🌱 Untuk penghuni kota & pemula',
              style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.leaf700),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Tumbuhkan kebun kecilmu di tengah kota.',
            style: GoogleFonts.poppins(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: AppTheme.leaf950,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Belanja tanaman sehat dari nursery terpercaya, kelola kebun pribadimu, dan dapatkan pengingat perawatan cerdas.',
            style: GoogleFonts.poppins(
              fontSize: 13,
              color: AppTheme.leaf900.withValues(alpha: 0.6),
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.push('/explore'),
                  icon: const Icon(Icons.storefront_outlined, size: 18),
                  label: const Text('Mulai belanja'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => context.push('/plant-finder'),
                  icon: const Icon(Icons.lightbulb_outline, size: 18),
                  label: const Text('Cari tanaman'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Stats
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _StatItem(value: '500+', label: 'Produk'),
              _StatItem(value: '120+', label: 'Nursery'),
              _StatItem(value: '10rb+', label: 'Kebun'),
              _StatItem(value: '4.9★', label: 'Rating'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCategories() {
    if (_categories.isEmpty) return const SizedBox();
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 8, 0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Belanja per kategori',
            style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(right: 24),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final cat = _categories[i];
                return GestureDetector(
                  onTap: () => context.push('/explore?category=${cat.slug}'),
                  child: Column(
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: AppTheme.leaf100,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Center(child: Text(cat.icon ?? '🪴', style: const TextStyle(fontSize: 28))),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        cat.name,
                        style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.leaf900),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatured() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 28, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '🔥 Produk paling laris',
                style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
              ),
              TextButton(
                onPressed: () => context.push('/explore'),
                child: Text(
                  'Lihat semua →',
                  style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.leaf700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (_loading)
            const LoadingWidget()
          else
            GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.62,
              ),
              itemCount: _featured.length,
              itemBuilder: (context, i) => ProductCard(product: _featured[i]),
            ),
        ],
      ),
    );
  }

  Widget _buildSmartFeatures() {
    final features = [
      {'icon': '🪴', 'title': 'My Garden', 'desc': 'Catat & pantau tanamanmu', 'route': '/my-garden', 'color': AppTheme.leaf600},
      {'icon': '💡', 'title': 'Plant Finder', 'desc': 'Temukan tanaman ideal', 'route': '/plant-finder', 'color': AppTheme.sun500},
      {'icon': '🩺', 'title': 'Plant Diagnosis', 'desc': 'Cek kesehatan tanaman', 'route': '/plant-diagnosis', 'color': const Color(0xFFEF4444)},
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 32, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Berkebun jadi lebih cerdas 🧠',
            style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white),
          ),
          const SizedBox(height: 12),
          ...features.map((f) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: GestureDetector(
              onTap: () => context.push(f['route'] as String),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: (f['color'] as Color).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: (f['color'] as Color).withValues(alpha: 0.2)),
                ),
                child: Row(
                  children: [
                    Text(f['icon'] as String, style: const TextStyle(fontSize: 32)),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            f['title'] as String,
                            style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
                          ),
                          Text(
                            f['desc'] as String,
                            style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6)),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.chevron_right_rounded, color: AppTheme.leaf900.withValues(alpha: 0.3)),
                  ],
                ),
              ),
            ),
          )),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.leaf800),
        ),
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)),
        ),
      ],
    );
  }
}
