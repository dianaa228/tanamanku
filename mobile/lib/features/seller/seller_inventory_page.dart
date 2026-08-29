import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import 'seller_provider.dart';
import '../../widgets/loading_widget.dart';

class SellerInventoryPage extends StatefulWidget {
  const SellerInventoryPage({super.key});
  @override
  State<SellerInventoryPage> createState() => _SellerInventoryPageState();
}

class _SellerInventoryPageState extends State<SellerInventoryPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<SellerProvider>().loadInventory());
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<SellerProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('📋 Inventaris')),
      body: sp.loading
          ? const LoadingWidget()
          : RefreshIndicator(
              onRefresh: () => sp.loadInventory(),
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: sp.inventory.length,
                itemBuilder: (context, i) {
                  final p = sp.inventory[i];
                  final stock = p['stock'] ?? 0;
                  final isLow = stock <= 5;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white, borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: isLow ? const Color(0xFFEF4444).withValues(alpha: 0.3) : AppTheme.leaf100),
                    ),
                    child: Row(
                      children: [
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(p['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                          const SizedBox(height: 4),
                          Text(AppFormatter.rupiah(p['price'] ?? 0), style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf700)),
                        ])),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: isLow ? const Color(0xFFFEF2F2) : AppTheme.leaf50,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            'Stok: $stock',
                            style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: isLow ? const Color(0xFFEF4444) : AppTheme.leaf700),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }
}
