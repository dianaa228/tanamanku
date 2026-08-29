import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../widgets/loading_widget.dart';
import '../../services/nursery_service.dart';

class NurseryDetailPage extends StatefulWidget {
  final String slug;
  const NurseryDetailPage({super.key, required this.slug});
  @override
  State<NurseryDetailPage> createState() => _NurseryDetailPageState();
}

class _NurseryDetailPageState extends State<NurseryDetailPage> {
  NurseryModel? nursery;
  List<NurseryProductModel> products = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final svc = NurseryService();
      nursery = await svc.getNursery(widget.slug);
      if (nursery != null) {
        products = await svc.getProducts(nursery!.id);
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Scaffold(body: LoadingWidget(label: 'Memuat nursery...'));
    if (nursery == null) return const Scaffold(body: Center(child: Text('Nursery tidak ditemukan')));

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: RefreshIndicator(
        onRefresh: _load,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 48, 20, 24),
                decoration: const BoxDecoration(gradient: LinearGradient(colors: [AppTheme.leaf600, AppTheme.leaf800])),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(nursery!.name, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 4),
                  if (nursery!.address != null) Text(nursery!.address!, style: GoogleFonts.poppins(fontSize: 13, color: Colors.white70)),
                  Text('${products.length} produk', style: GoogleFonts.poppins(fontSize: 12, color: Colors.white60)),
                ]),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Text('Produk', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate((context, i) {
                final p = products[i];
                return Container(
                  margin: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
                  child: Row(children: [
                    Container(width: 48, height: 48, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('🪴', style: TextStyle(fontSize: 24)))),
                    const SizedBox(width: 12),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(p.name, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                      if (p.price != null) Text(AppFormatter.rupiah(p.price!.toInt()), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
                    ])),
                  ]),
                );
              }, childCount: products.length),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 40)),
          ],
        ),
      ),
    );
  }
}
