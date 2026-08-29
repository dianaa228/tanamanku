import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../features/auth/auth_provider.dart';
import '../marketplace/marketplace_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/product_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _promoController = PageController(viewportFraction: 0.88);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final mp = context.read<MarketplaceProvider>();
      if (mp.categories.isEmpty && !mp.loading) {
        mp.loadInitial();
      }
    });
  }

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mp = context.watch<MarketplaceProvider>();
    final auth = context.watch<AuthProvider>();
    final userName = auth.user?.name.split(' ').first ?? 'Pekebun';

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: RefreshIndicator(
        onRefresh: () => mp.loadInitial(),
        child: CustomScrollView(
          slivers: [
            // ── Greeting + Hero ──
            SliverToBoxAdapter(child: _buildHero(userName)),

            // ── Promo Banner Carousel ──
            SliverToBoxAdapter(child: _buildPromoBanners()),

            // ── Quick Access Grid ──
            SliverToBoxAdapter(child: _buildQuickAccess()),

            // ── Kategori ──
            SliverToBoxAdapter(child: _buildCategories(mp)),

            // ── Produk pilihan (Best Sellers) ──
            SliverToBoxAdapter(child: _buildFeatured(mp)),

            // ── Tips Berkebun ──
            SliverToBoxAdapter(child: _buildTips()),

            // ── Fitur cerdas ──
            SliverToBoxAdapter(child: _buildSmartFeatures()),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════════════════════════════
  Widget _buildHero(String userName) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 28),
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
          // Greeting
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.04), blurRadius: 8),
                  ],
                ),
                child: Text(
                  '🌱 Untuk penghuni kota & pemula',
                  style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.leaf700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Halo, $userName 👋',
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppTheme.leaf900.withValues(alpha: 0.6),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Tumbuhkan kebun\nkecilmu di tengah kota.',
            style: GoogleFonts.poppins(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: AppTheme.leaf950,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 20),
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
          const SizedBox(height: 20),
          // Stats
          Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.leaf100),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _StatItem(value: '500+', label: 'Produk'),
                _StatItem(value: '120+', label: 'Nursery'),
                _StatItem(value: '10rb+', label: 'Kebun'),
                _StatItem(value: '4.9★', label: 'Rating'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PROMO BANNER CAROUSEL
  // ═══════════════════════════════════════════════════════════
  Widget _buildPromoBanners() {
    final promos = [
      {
        'title': 'Gratis Ongkir 🚚',
        'subtitle': 'Untuk pembelian pertama di atas Rp100rb',
        'gradient': [AppTheme.leaf600, AppTheme.leaf400],
        'route': '/explore',
      },
      {
        'title': 'Poin 2x Lipat ⭐',
        'subtitle': 'Belanja minggu ini & dapatkan bonus poin',
        'gradient': [AppTheme.sun500, AppTheme.sun300],
        'route': '/loyalty',
      },
      {
        'title': 'Tukar Tanaman 🌿',
        'subtitle': 'Jual atau tukar tanamanmu dengan pekebun lain',
        'gradient': [const Color(0xFF0EA5E9), const Color(0xFF7DD3FC)],
        'route': '/plant-exchange',
      },
    ];

    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text(
              'Promo menarik 🔥',
              style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 110,
            child: PageView.builder(
              controller: _promoController,
              itemCount: promos.length,
              itemBuilder: (context, i) {
                final promo = promos[i];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: GestureDetector(
                    onTap: () => context.push(promo['route'] as String),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: promo['gradient'] as List<Color>,
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            promo['title'] as String,
                            style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            promo['subtitle'] as String,
                            style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withValues(alpha: 0.85)),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // QUICK ACCESS GRID
  // ═══════════════════════════════════════════════════════════
  Widget _buildQuickAccess() {
    final items = [
      {'icon': '🌱', 'label': 'Plant Finder', 'route': '/plant-finder', 'color': const Color(0xFF16A34A)},
      {'icon': '🩺', 'label': 'Diagnosis', 'route': '/plant-diagnosis', 'color': const Color(0xFFEF4444)},
      {'icon': '🔄', 'label': 'Exchange', 'route': '/plant-exchange', 'color': const Color(0xFF0EA5E9)},
      {'icon': '🏆', 'label': 'Rewards', 'route': '/loyalty', 'color': AppTheme.sun500},
      {'icon': '🏡', 'label': 'Nursery', 'route': '/nurseries', 'color': const Color(0xFF8B5CF6)},
      {'icon': '🔧', 'label': 'Jasa', 'route': '/services', 'color': const Color(0xFFF97316)},
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Akses cepat ⚡',
            style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.85,
            ),
            itemCount: items.length,
            itemBuilder: (context, i) {
              final item = items[i];
              final color = item['color'] as Color;
              return GestureDetector(
                onTap: () => context.push(item['route'] as String),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Center(child: Text(item['icon'] as String, style: const TextStyle(fontSize: 24))),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item['label'] as String,
                      style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.leaf900),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════
  Widget _buildCategories(MarketplaceProvider mp) {
    if (mp.categories.isEmpty) return const SizedBox();
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 28, 0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Belanja per kategori',
                style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
              ),
              TextButton(
                onPressed: () => context.push('/explore'),
                child: Text('Semua →', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.leaf700)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(right: 24),
              itemCount: mp.categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final cat = mp.categories[i];
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

  // ═══════════════════════════════════════════════════════════
  // BEST SELLERS (Featured)
  // ═══════════════════════════════════════════════════════════
  Widget _buildFeatured(MarketplaceProvider mp) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 28, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '🔥 Terlaris minggu ini',
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
          if (mp.loading)
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
              itemCount: mp.featured.length,
              itemBuilder: (context, i) => ProductCard(product: mp.featured[i]),
            ),
        ],
      ),
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TIPS BERKEBUN
  // ═══════════════════════════════════════════════════════════
  Widget _buildTips() {
    final tips = [
      {
        'icon': '💧',
        'title': 'Siram di pagi hari',
        'desc': 'Tanaman menyerap air lebih baik sebelum matahari terik.',
        'color': const Color(0xFF0EA5E9),
      },
      {
        'icon': '☀️',
        'title': 'Perhatikan cahaya',
        'desc': 'Sesuaikan posisi tanaman dengan kebutuhan sinar mataharinya.',
        'color': AppTheme.sun500,
      },
      {
        'icon': '🪴',
        'title': 'Ganti pot secara berkala',
        'desc': 'Tanaman yang akarnya penuh butuh rumah baru yang lebih besar.',
        'color': AppTheme.leaf600,
      },
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 28, 24, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tips berkebun 💡',
            style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 130,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: tips.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) {
                final tip = tips[i];
                final color = tip['color'] as Color;
                return Container(
                  width: 200,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.06),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: color.withValues(alpha: 0.15)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(tip['icon'] as String, style: const TextStyle(fontSize: 28)),
                      const SizedBox(height: 8),
                      Text(
                        tip['title'] as String,
                        style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tip['desc'] as String,
                        style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.6), height: 1.4),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
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

  // ═══════════════════════════════════════════════════════════
  // SMART FEATURES
  // ═══════════════════════════════════════════════════════════
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
            style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
          ),
          const SizedBox(height: 12),
          ...features.map((f) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: GestureDetector(
              onTap: () => context.push(f['route'] as String),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.leaf100),
                  boxShadow: [
                    BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2)),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: (f['color'] as Color).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Center(child: Text(f['icon'] as String, style: const TextStyle(fontSize: 24))),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            f['title'] as String,
                            style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.leaf950),
                          ),
                          Text(
                            f['desc'] as String,
                            style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5)),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.chevron_right_rounded, color: AppTheme.leaf900.withValues(alpha: 0.2)),
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

// ═══════════════════════════════════════════════════════════
// STAT ITEM
// ═══════════════════════════════════════════════════════════
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
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.leaf800),
        ),
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5)),
        ),
      ],
    );
  }
}
