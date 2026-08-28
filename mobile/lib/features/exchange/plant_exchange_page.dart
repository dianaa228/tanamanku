import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/exchange_service.dart';
import '../../widgets/loading_widget.dart';

/// Halaman Browse Plant Exchange — listings, filter tipe, search.
class PlantExchangePage extends StatefulWidget {
  const PlantExchangePage({super.key});

  @override
  State<PlantExchangePage> createState() => _PlantExchangePageState();
}

class _PlantExchangePageState extends State<PlantExchangePage> {
  final _service = ExchangeService();
  List<PlantListingModel> _listings = [];
  bool _loading = true;
  String? _filterType;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      _listings = await _service.getListings(type: _filterType);
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: Text('Plant Exchange 🌿', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () => context.push('/plant-exchange/create'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                _chip('Semua', null),
                const SizedBox(width: 8),
                _chip('🏷️ Dijual', 'sell'),
                const SizedBox(width: 8),
                _chip('🔄 Tukar Tukar', 'exchange'),
              ],
            ),
          ),
          // Listings
          Expanded(
            child: _loading
                ? const LoadingWidget()
                : _listings.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('🌱', style: TextStyle(fontSize: 64)),
                            const SizedBox(height: 16),
                            Text('Belum ada listing', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _load,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(20),
                          itemCount: _listings.length,
                          itemBuilder: (context, i) => _ListingCard(listing: _listings[i]),
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _chip(String label, String? type) {
    final selected = _filterType == type;
    return GestureDetector(
      onTap: () { setState(() => _filterType = type); _load(); },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? AppTheme.leaf600 : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
        ),
        child: Text(label, style: GoogleFonts.poppins(
          fontSize: 12, fontWeight: FontWeight.w600,
          color: selected ? Colors.white : AppTheme.leaf900,
        )),
      ),
    );
  }
}

class _ListingCard extends StatelessWidget {
  final PlantListingModel listing;
  const _ListingCard({required this.listing});

  @override
  Widget build(BuildContext context) {
    final isSell = listing.type == 'sell';
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.leaf100),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(14),
        leading: Container(
          width: 56, height: 56,
          decoration: BoxDecoration(
            color: isSell ? const Color(0xFFFEF3C7) : const Color(0xFFDBEAFE),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Center(child: Text(isSell ? '🏷️' : '🔄', style: const TextStyle(fontSize: 28))),
        ),
        title: Text(listing.title, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
        subtitle: Text(
          isSell && listing.price != null ? 'Rp ${listing.price!.toInt()}' : (listing.description ?? ''),
          style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6)),
          maxLines: 1, overflow: TextOverflow.ellipsis,
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => context.push('/plant-exchange/${listing.id}'),
      ),
    );
  }
}
