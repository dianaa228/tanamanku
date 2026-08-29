import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../widgets/loading_widget.dart';
import '../../services/service_service.dart';

class ServiceDetailPage extends StatefulWidget {
  final int serviceId;
  const ServiceDetailPage({super.key, required this.serviceId});
  @override
  State<ServiceDetailPage> createState() => _ServiceDetailPageState();
}

class _ServiceDetailPageState extends State<ServiceDetailPage> {
  GardeningServiceModel? service;
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      service = await GardeningApiService().getService(widget.serviceId);
    } catch (_) {}
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const Scaffold(body: LoadingWidget(label: 'Memuat layanan...'));
    if (service == null) return const Scaffold(body: Center(child: Text('Layanan tidak ditemukan')));

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
                  Text(service!.name, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(service!.categoryLabel, style: GoogleFonts.poppins(fontSize: 13, color: Colors.white70)),
                ]),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  if (service!.description != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Text(service!.description!, style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf900.withValues(alpha: 0.7))),
                    ),
                  Text('Harga', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
                    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('Mulai dari', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.6))),
                      Text(service!.pricePerVisit != null ? AppFormatter.rupiah(service!.pricePerVisit!.toInt()) : 'Hubungi',
                          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.leaf700)),
                    ]),
                  ),
                  if (service!.serviceArea != null) ...[
                    const SizedBox(height: 12),
                    Text('Area layanan: ${service!.serviceArea}', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                  ],
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
