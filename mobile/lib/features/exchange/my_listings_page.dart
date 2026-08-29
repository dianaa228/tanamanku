import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'exchange_provider.dart';
import '../../widgets/loading_widget.dart';

class MyListingsPage extends StatefulWidget {
  const MyListingsPage({super.key});
  @override
  State<MyListingsPage> createState() => _MyListingsPageState();
}

class _MyListingsPageState extends State<MyListingsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<ExchangeProvider>().loadListings());
  }

  @override
  Widget build(BuildContext context) {
    final ep = context.watch<ExchangeProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('📦 Listing Saya')),
      body: ep.loading
          ? const LoadingWidget()
          : Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text('📦', style: TextStyle(fontSize: 56)),
                const SizedBox(height: 12),
                Text('Belum ada listing', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text('Buat listing untuk menjual atau menukar tanamanmu', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: () => context.push('/plant-exchange'),
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text('Buat Listing'),
                ),
              ]),
            ),
    );
  }
}
