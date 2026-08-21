import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/exchange_service.dart';
import '../../widgets/loading_widget.dart';

/// Detail halaman listing Plant Exchange
class ListingDetailPage extends StatefulWidget {
  final int listingId;
  const ListingDetailPage({super.key, required this.listingId});

  @override
  State<ListingDetailPage> createState() => _ListingDetailPageState();
}

class _ListingDetailPageState extends State<ListingDetailPage> {
  final _service = ExchangeService();
  PlantListingModel? _listing;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      _listing = await _service.getListing(widget.listingId);
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text(_loading ? '...' : (_listing?.title ?? 'Detail'))),
      body: _loading
          ? const LoadingWidget()
          : _listing == null
              ? const Center(child: Text('Listing tidak ditemukan'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: _listing!.type == 'sell' ? const Color(0xFFFEF3C7) : const Color(0xFFDBEAFE),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(_listing!.type == 'sell' ? '🏷️' : '🔄', style: const TextStyle(fontSize: 24)),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(_listing!.title, style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 18)),
                                      Text(_listing!.type == 'sell' ? 'Dijual' : 'Tukar Tukar',
                                          style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withOpacity(0.5))),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            if (_listing!.price != null) ...[
                              const SizedBox(height: 16),
                              Text('Rp ${_listing!.price!.toInt()}', style: GoogleFonts.poppins(fontWeight: FontWeight.w800, fontSize: 24, color: AppTheme.leaf700)),
                            ],
                            if (_listing!.description != null) ...[
                              const SizedBox(height: 16),
                              Text(_listing!.description!, style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf900.withOpacity(0.7), height: 1.5)),
                            ],
                          ],
                        ),
                      ),

                      // Owner info
                      if (_listing!.owner != null) ...[
                        const SizedBox(height: 12),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                          child: Row(
                            children: [
                              CircleAvatar(
                                backgroundColor: AppTheme.leaf200,
                                child: Text((_listing!.owner!['name'] ?? '?')[0].toString().toUpperCase(),
                                    style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
                              ),
                              const SizedBox(width: 12),
                              Text(_listing!.owner!['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
      bottomNavigationBar: _listing != null
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: ElevatedButton(
                  onPressed: () => _showOfferSheet(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.leaf600,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Text('Kirim Tawaran 💬', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)),
                ),
              ),
            )
          : null,
    );
  }

  void _showOfferSheet() {
    final ctrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AppTheme.leaf200, borderRadius: BorderRadius.circular(2)))),
            const SizedBox(height: 16),
            Text('Kirim Tawaran 💬', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 18)),
            const SizedBox(height: 12),
            TextField(
              controller: ctrl,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Pesan untuk pemilik listing...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  await _service.makeOffer(widget.listingId, message: ctrl.text);
                  if (ctx.mounted) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tawaran terkirim! 🎉')));
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.leaf600, padding: const EdgeInsets.symmetric(vertical: 14)),
                child: Text('Kirim', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
