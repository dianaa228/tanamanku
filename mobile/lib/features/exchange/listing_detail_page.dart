import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'exchange_provider.dart';
import '../../widgets/loading_widget.dart';

class ListingDetailPage extends StatefulWidget {
  final int listingId;
  const ListingDetailPage({super.key, required this.listingId});

  @override
  State<ListingDetailPage> createState() => _ListingDetailPageState();
}

class _ListingDetailPageState extends State<ListingDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ExchangeProvider>().loadListing(widget.listingId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final exchange = context.watch<ExchangeProvider>();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text(exchange.loading ? '...' : (exchange.currentListing?.title ?? 'Detail'))),
      body: exchange.loading
          ? const LoadingWidget()
          : exchange.currentListing == null
              ? const Center(child: Text('Listing tidak ditemukan'))
              : _buildDetail(exchange),
      bottomNavigationBar: exchange.currentListing != null
          ? SafeArea(child: Padding(padding: const EdgeInsets.all(20), child: ElevatedButton(
              onPressed: () => _showOfferSheet(exchange),
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.leaf600, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              child: Text('Kirim Tawaran 💬', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)))))
          : null,
    );
  }

  Widget _buildDetail(ExchangeProvider exchange) {
    final listing = exchange.currentListing!;
    return SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(width: double.infinity, padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: listing.type == 'sell' ? const Color(0xFFFEF3C7) : const Color(0xFFDBEAFE), borderRadius: BorderRadius.circular(12)),
              child: Text(listing.type == 'sell' ? '🏷️' : '🔄', style: const TextStyle(fontSize: 24))),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(listing.title, style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 18)),
              Text(listing.type == 'sell' ? 'Dijual' : 'Tukar Tukar', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5))),
            ])),
          ]),
          if (listing.price != null) ...[const SizedBox(height: 16), Text('Rp ${listing.price!.toInt()}', style: GoogleFonts.poppins(fontWeight: FontWeight.w800, fontSize: 24, color: AppTheme.leaf700))],
          if (listing.description != null) ...[const SizedBox(height: 16), Text(listing.description!, style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf900.withValues(alpha: 0.7), height: 1.5))],
        ])),
      if (listing.owner != null) ...[
        const SizedBox(height: 12),
        Container(width: double.infinity, padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
          child: Row(children: [
            CircleAvatar(backgroundColor: AppTheme.leaf200, child: Text((listing.owner!['name'] ?? '?')[0].toString().toUpperCase(), style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
            const SizedBox(width: 12),
            Text(listing.owner!['name'] ?? '', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
          ])),
      ],
    ]));
  }

  void _showOfferSheet(ExchangeProvider exchange) {
    final ctrl = TextEditingController();
    showModalBottomSheet(context: context, isScrollControlled: true, shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AppTheme.leaf200, borderRadius: BorderRadius.circular(2)))),
          const SizedBox(height: 16),
          Text('Kirim Tawaran 💬', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 18)),
          const SizedBox(height: 12),
          TextField(controller: ctrl, maxLines: 3, decoration: InputDecoration(hintText: 'Pesan untuk pemilik listing...', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)))),
          const SizedBox(height: 12),
          SizedBox(width: double.infinity, child: ElevatedButton(
            onPressed: () async {
              final success = await exchange.makeOffer(exchange.currentListing!.id, message: ctrl.text);
              if (!ctx.mounted) return;
              Navigator.pop(ctx);
              if (success && mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tawaran terkirim! 🎉')));
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.leaf600, padding: const EdgeInsets.symmetric(vertical: 14)),
            child: Text('Kirim', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)),
          )),
        ])));
  }
}
