import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'gardening_service_provider.dart';
import '../../widgets/loading_widget.dart';

class MyBookingsPage extends StatefulWidget {
  const MyBookingsPage({super.key});
  @override
  State<MyBookingsPage> createState() => _MyBookingsPageState();
}

class _MyBookingsPageState extends State<MyBookingsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<GardeningServiceProvider>().loadServices());
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<GardeningServiceProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('📋 Booking Saya')),
      body: sp.loading
          ? const LoadingWidget()
          : Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text('📋', style: TextStyle(fontSize: 56)),
                const SizedBox(height: 12),
                Text('Belum ada booking', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text('Pesan jasa berkebun untuk merawat tanamanmu', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: () => context.push('/services'),
                  icon: const Icon(Icons.search, size: 18),
                  label: const Text('Cari Jasa'),
                ),
              ]),
            ),
    );
  }
}
