import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'nursery_provider.dart';
import '../../widgets/loading_widget.dart';

/// Halaman Directory Nursery — browse local plant shops.
class NurseriesPage extends StatefulWidget {
  const NurseriesPage({super.key});

  @override
  State<NurseriesPage> createState() => _NurseriesPageState();
}

class _NurseriesPageState extends State<NurseriesPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<NurseryProvider>().loadNurseries();
    });
  }

  @override
  Widget build(BuildContext context) {
    final nursery = context.watch<NurseryProvider>();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text('Nursery 🌿', style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
      body: nursery.loading
          ? const LoadingWidget()
          : nursery.nurseries.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🏡', style: TextStyle(fontSize: 64)),
                      const SizedBox(height: 16),
                      Text('Belum ada nursery terdaftar', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: () => nursery.loadNurseries(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: nursery.nurseries.length,
                    itemBuilder: (context, i) {
                      final n = nursery.nurseries[i];
                      return GestureDetector(
                        onTap: () => context.push('/nurseries/${n.id}'),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
                          child: Row(
                            children: [
                              Container(
                                width: 56, height: 56,
                                decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(14)),
                                child: const Center(child: Text('🏡', style: TextStyle(fontSize: 28))),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(n.name, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                                    if (n.address != null)
                                      Text(n.address!, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)), maxLines: 1, overflow: TextOverflow.ellipsis),
                                  ],
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: AppTheme.leaf300),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
