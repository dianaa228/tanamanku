import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminCategoriesPage extends StatefulWidget {
  const AdminCategoriesPage({super.key});
  @override
  State<AdminCategoriesPage> createState() => _AdminCategoriesPageState();
}

class _AdminCategoriesPageState extends State<AdminCategoriesPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadCategories());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('🏷️ Kategori')),
      body: ap.loading ? const LoadingWidget() : RefreshIndicator(
        onRefresh: () => ap.loadCategories(),
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: ap.categories.length,
          itemBuilder: (context, i) {
            final c = ap.categories[i];
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf100)),
              child: Row(children: [
                Container(width: 44, height: 44, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(12)), child: Center(child: Text(c['icon'] ?? '🪴', style: const TextStyle(fontSize: 22)))),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(c['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                  Text('${c['products_count'] ?? 0} produk', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                ])),
              ]),
            );
          },
        ),
      ),
    );
  }
}
