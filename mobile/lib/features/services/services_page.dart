import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../services/service_service.dart';
import '../../widgets/loading_widget.dart';

/// Halaman Browse Gardening Services
class ServicesPage extends StatefulWidget {
  const ServicesPage({super.key});

  @override
  State<ServicesPage> createState() => _ServicesPageState();
}

class _ServicesPageState extends State<ServicesPage> {
  final _service = GardeningApiService();
  List<GardeningServiceModel> _services = [];
  bool _loading = true;
  String? _filterCategory;

  static const _categories = [
    {'value': null, 'label': 'Semua', 'icon': '🌿'},
    {'value': 'landscaping', 'label': 'Landscaping', 'icon': '🌳'},
    {'value': 'maintenance', 'label': 'Perawatan', 'icon': '🔧'},
    {'value': 'planting', 'label': 'Penanaman', 'icon': '🌱'},
    {'value': 'pest-control', 'label': 'Hama', 'icon': '🐛'},
    {'value': 'consultation', 'label': 'Konsultasi', 'icon': '📋'},
    {'value': 'delivery', 'label': 'Pengantaran', 'icon': '🚚'},
  ];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _services = await _service.getServices(category: _filterCategory);
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text('Jasa Berkebun 🔧', style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
      body: Column(
        children: [
          // Category filter
          SizedBox(
            height: 56,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final cat = _categories[i];
                final selected = _filterCategory == cat['value'];
                return GestureDetector(
                  onTap: () { setState(() => _filterCategory = cat['value']); _load(); },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: selected ? AppTheme.leaf600 : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                    ),
                    child: Row(
                      children: [
                        Text(cat['icon'] as String, style: const TextStyle(fontSize: 16)),
                        const SizedBox(width: 6),
                        Text(cat['label'] as String, style: GoogleFonts.poppins(
                          fontSize: 12, fontWeight: FontWeight.w600,
                          color: selected ? Colors.white : AppTheme.leaf900,
                        )),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          // Services list
          Expanded(
            child: _loading
                ? const LoadingWidget()
                : _services.isEmpty
                    ? Center(child: Text('Belum ada layanan', style: GoogleFonts.poppins(color: AppTheme.leaf900.withValues(alpha: 0.5))))
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(20),
                          itemCount: _services.length,
                          itemBuilder: (context, i) => _ServiceCard(service: _services[i]),
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}

class _ServiceCard extends StatelessWidget {
  final GardeningServiceModel service;
  const _ServiceCard({required this.service});

  @override
  Widget build(BuildContext context) {
    final fmt = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp', decimalDigits: 0);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
      child: Row(
        children: [
          Container(
            width: 56, height: 56,
            decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(14)),
            child: Center(child: Text(service.categoryIcon, style: const TextStyle(fontSize: 28))),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(service.name, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                const SizedBox(height: 2),
                Text(service.categoryLabel, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                if (service.pricePerVisit != null) ...[
                  const SizedBox(height: 4),
                  Text(fmt.format(service.pricePerVisit), style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700, fontSize: 13)),
                ],
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppTheme.leaf300),
        ],
      ),
    );
  }
}
