import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../core/utils/app_formatter.dart';
import '../../core/utils/plant_emoji.dart';
import 'garden_provider.dart';
import '../../widgets/loading_widget.dart';

class PlantDetailPage extends StatefulWidget {
  final int plantId;
  const PlantDetailPage({super.key, required this.plantId});

  @override
  State<PlantDetailPage> createState() => _PlantDetailPageState();
}

class _PlantDetailPageState extends State<PlantDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<GardenProvider>().loadPlant(widget.plantId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final garden = context.watch<GardenProvider>();

    if (garden.loading) return const Scaffold(body: LoadingWidget());
    final plant = garden.currentPlant;
    if (plant == null) return const Scaffold(body: Center(child: Text('Tanaman tidak ditemukan')));

    final species = plant.species;
    final statusColor = _statusColor(plant.status);

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200, pinned: true,
            leading: IconButton(icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20), onPressed: () => context.pop()),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(plant.nickname, style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 16)),
              background: Container(decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [AppTheme.leaf200, AppTheme.leaf100])),
                child: Center(child: Text(_plantEmoji(species?.name, species?.slug), style: const TextStyle(fontSize: 64)))),
            ),
          ),
          SliverToBoxAdapter(child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                child: Text(_statusLabel(plant.status), style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor))),
              const SizedBox(width: 8),
              if (species != null) Text(species.scientificName ?? '', style: GoogleFonts.poppins(fontSize: 11, fontStyle: FontStyle.italic, color: AppTheme.leaf900.withValues(alpha: 0.5))),
            ]),
            const SizedBox(height: 16),
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
              child: Column(children: [
                _infoRow('📍 Lokasi', plant.location ?? '—'),
                _infoRow('🏺 Pot', plant.pot ?? '—'),
                _infoRow('📅 Ditanam', AppFormatter.date(plant.plantedAt)),
                _infoRow('📏 Tinggi', plant.heightCm != null ? '${plant.heightCm!.toInt()} cm' : '—'),
              ])),
            const SizedBox(height: 20),
            SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: () async {
                await garden.waterPlant(plant.id);
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Penyiraman dicatat! 💚')));
              },
              icon: const Icon(Icons.water_drop_outlined, size: 18), label: const Text('Siram sekarang'))),
            const SizedBox(height: 24),
            if (species != null) ...[
              Text('Panduan ${species.name}', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              _guideRow('☀️', 'Cahaya', species.lightRequirement ?? '—'),
              _guideRow('💧', 'Air', species.waterRequirement ?? '—'),
              _guideRow('💨', 'Kelembapan', species.humidity ?? '—'),
              _guideRow('🌡️', 'Suhu', species.temperature ?? '—'),
            ],
            const SizedBox(height: 24),
            if (plant.growthLogs.isNotEmpty) ...[
              Text('📈 Riwayat Pertumbuhan', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              ...plant.growthLogs.reversed.take(5).map((log) => Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.leaf100)),
                child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(AppFormatter.date(log.loggedAt), style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6))),
                  Text('${log.heightCm?.toInt() ?? 0} cm', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                ]))),
            ],
            const SizedBox(height: 24),
            if (plant.reminders.isNotEmpty) ...[
              Text('🔔 Jadwal Perawatan', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              ...plant.reminders.where((r) => r.isActive).map((r) {
                final days = r.daysUntilDue;
                return Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.leaf100)),
                  child: Row(children: [
                    Text(_careEmoji(r.type), style: const TextStyle(fontSize: 20)),
                    const SizedBox(width: 12),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(AppConstants.careTypes[r.type] ?? r.type, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                      Text(days != null ? (days <= 0 ? 'Jatuh tempo!' : '$days hari lagi') : '—', style: GoogleFonts.poppins(fontSize: 11, color: days != null && days <= 0 ? const Color(0xFFEF4444) : AppTheme.leaf900.withValues(alpha: 0.5))),
                    ])),
                    TextButton(onPressed: () => garden.markReminderDone(r.id), child: Text('✓', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf600))),
                  ]));
              }),
            ],
            const SizedBox(height: 40),
          ]))),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) => Padding(padding: const EdgeInsets.symmetric(vertical: 6), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
    Text(label, style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6))),
    Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
  ]));

  Widget _guideRow(String icon, String label, String value) => Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [
    Text(icon, style: const TextStyle(fontSize: 18)), const SizedBox(width: 12),
    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.leaf900.withValues(alpha: 0.4))),
      Text(value, style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.7))),
    ]),
  ]));

  Color _statusColor(String status) {
    switch (status) {
      case AppConstants.plantHealthy: return AppTheme.leaf600;
      case AppConstants.plantNeedsWater: return const Color(0xFF0EA5E9);
      case AppConstants.plantNeedsAttention: return const Color(0xFFF59E0B);
      default: return AppTheme.leaf600;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case AppConstants.plantHealthy: return '😊 Sehat';
      case AppConstants.plantNeedsWater: return '💧 Perlu air';
      case AppConstants.plantNeedsAttention: return '⚠️ Perlu perhatian';
      default: return '—';
    }
  }

  String _plantEmoji(String? name, String? slug) => plantEmoji(name: name, slug: slug);

  String _careEmoji(String type) {
    switch (type) {
      case 'siram': return '💧';
      case 'pupuk': return '🧪';
      case 'repot': return '🏺';
      case 'cek-hama': return '🔍';
      case 'potong': return '✂️';
      default: return '🔔';
    }
  }
}
