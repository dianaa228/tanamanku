import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../core/utils/app_formatter.dart';
import '../../models/user_plant_model.dart';
import '../../services/garden_service.dart';
import '../../widgets/loading_widget.dart';

class PlantDetailPage extends StatefulWidget {
  final int plantId;
  const PlantDetailPage({super.key, required this.plantId});

  @override
  State<PlantDetailPage> createState() => _PlantDetailPageState();
}

class _PlantDetailPageState extends State<PlantDetailPage> {
  final _service = GardenService();
  UserPlantModel? _plant;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPlant();
  }

  Future<void> _loadPlant() async {
    try {
      final plant = await _service.getPlant(widget.plantId);
      if (mounted) setState(() { _plant = plant; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());
    final plant = _plant;
    if (plant == null) return const Scaffold(body: Center(child: Text('Tanaman tidak ditemukan')));

    final species = plant.species;
    final statusColor = _statusColor(plant.status);

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(plant.nickname, style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 16)),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppTheme.leaf200, AppTheme.leaf100],
                  ),
                ),
                child: Center(
                  child: Text(_plantEmoji(species?.slug), style: const TextStyle(fontSize: 64)),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status & species
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _statusLabel(plant.status),
                          style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor),
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (species != null)
                        Text(species.scientificName ?? '', style: GoogleFonts.poppins(fontSize: 11, fontStyle: FontStyle.italic, color: AppTheme.leaf900.withOpacity(0.5))),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Info grid
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
                    child: Column(
                      children: [
                        _infoRow('📍 Lokasi', plant.location ?? '—'),
                        _infoRow('🏺 Pot', plant.pot ?? '—'),
                        _infoRow('📅 Ditanam', AppFormatter.date(plant.plantedAt)),
                        _infoRow('📏 Tinggi', plant.heightCm != null ? '${plant.heightCm!.toInt()} cm' : '—'),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Siram sekarang
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        await _service.waterPlant(plant.id);
                        _loadPlant();
                        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Penyiraman dicatat! 💚')));
                      },
                      icon: const Icon(Icons.water_drop_outlined, size: 18),
                      label: const Text('Siram sekarang'),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Panduan spesies
                  if (species != null) ...[
                    Text('Panduan ${species.name}', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 12),
                    _guideRow('☀️', 'Cahaya', species.lightRequirement ?? '—'),
                    _guideRow('💧', 'Air', species.waterRequirement ?? '—'),
                    _guideRow('💨', 'Kelembapan', species.humidity ?? '—'),
                    _guideRow('🌡️', 'Suhu', species.temperature ?? '—'),
                  ],

                  const SizedBox(height: 24),

                  // Riwayat pertumbuhan
                  if (plant.growthLogs.isNotEmpty) ...[
                    Text('📈 Riwayat Pertumbuhan', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 12),
                    ...plant.growthLogs.reversed.take(5).map((log) => Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.leaf100)),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(AppFormatter.date(log.loggedAt), style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withOpacity(0.6))),
                          Text('${log.heightCm?.toInt() ?? 0} cm', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    )),
                  ],

                  const SizedBox(height: 24),

                  // Jadwal perawatan
                  if (plant.reminders.isNotEmpty) ...[
                    Text('🔔 Jadwal Perawatan', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 12),
                    ...plant.reminders.where((r) => r.isActive).map((r) {
                      final days = r.daysUntilDue;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppTheme.leaf100)),
                        child: Row(
                          children: [
                            Text(_careEmoji(r.type), style: const TextStyle(fontSize: 20)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(AppConstants.careTypes[r.type] ?? r.type, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                                  Text(
                                    days != null ? (days <= 0 ? 'Jatuh tempo!' : '$days hari lagi') : '—',
                                    style: GoogleFonts.poppins(
                                      fontSize: 11,
                                      color: days != null && days <= 0 ? const Color(0xFFEF4444) : AppTheme.leaf900.withOpacity(0.5),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            TextButton(
                              onPressed: () async {
                                await _service.markReminderDone(r.id);
                                _loadPlant();
                              },
                              child: Text('✓', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf600)),
                            ),
                          ],
                        ),
                      );
                    }),
                  ],

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withOpacity(0.6))),
          Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _guideRow(String icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 18)),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.leaf900.withOpacity(0.4))),
              Text(value, style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withOpacity(0.7))),
            ],
          ),
        ],
      ),
    );
  }

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

  String _plantEmoji(String? slug) {
    switch (slug) {
      case 'monstera-deliciosa': return '🌿';
      case 'sirih-gading': return '🍃';
      case 'aglonema': return '🪴';
      case 'lidah-mertua': return '🌵';
      case 'cabai-rawit': return '🌶️';
      case 'tomat-cherry': return '🍅';
      case 'kemangi': return '🌿';
      case 'aloe-vera': return '🌵';
      default: return '🪴';
    }
  }

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
