import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_constants.dart';
import '../core/theme/app_theme.dart';
import '../models/user_plant_model.dart';

/// Kartu tanaman untuk My Garden.
class PlantCard extends StatelessWidget {
  final UserPlantModel plant;

  const PlantCard({super.key, required this.plant});

  @override
  Widget build(BuildContext context) {
    final species = plant.species;
    final statusColor = _statusColor(plant.status);
    final statusLabel = _statusLabel(plant.status);

    return GestureDetector(
      onTap: () => context.push('/my-garden/${plant.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.leaf100),
          boxShadow: [
            BoxShadow(
              color: AppTheme.leaf900.withValues(alpha: 0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Gambar tanaman
            Container(
              height: 100,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                gradient: _plantGradient(species?.slug),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Text(
                      _plantEmoji(species?.slug),
                      style: const TextStyle(fontSize: 40),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: statusColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        statusLabel,
                        style: GoogleFonts.poppins(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: statusColor,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Info tanaman
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    plant.nickname,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.leaf950,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    species?.name ?? '—',
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      color: AppTheme.leaf900.withValues(alpha: 0.5),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _infoChip('📍', plant.location ?? '—'),
                      const SizedBox(width: 6),
                      if (plant.heightCm != null) _infoChip('📏', '${plant.heightCm!.toInt()} cm'),
                    ],
                  ),
                  const SizedBox(height: 6),
                  _infoChip('💧', _nextWaterText()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoChip(String icon, String text) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: AppTheme.leaf50,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          '$icon $text',
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: GoogleFonts.poppins(
            fontSize: 9,
            color: AppTheme.leaf900.withValues(alpha: 0.6),
          ),
        ),
      ),
    );
  }

  String _nextWaterText() {
    final reminder = plant.reminders.where((r) => r.type == 'siram' && r.isActive).firstOrNull;
    if (reminder?.nextDueAt == null) return 'Atur jadwal';
    final days = reminder!.daysUntilDue;
    if (days == null || days < 0) return 'Jatuh tempo!';
    if (days == 0) return 'Hari ini';
    return '$days hari lagi';
  }

  Color _statusColor(String status) {
    switch (status) {
      case AppConstants.plantHealthy:
        return AppTheme.leaf600;
      case AppConstants.plantNeedsWater:
        return const Color(0xFF0EA5E9);
      case AppConstants.plantNeedsAttention:
        return const Color(0xFFF59E0B);
      default:
        return AppTheme.leaf600;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case AppConstants.plantHealthy:
        return '😊 Sehat';
      case AppConstants.plantNeedsWater:
        return '💧 Perlu air';
      case AppConstants.plantNeedsAttention:
        return '⚠️ Perhatian';
      default:
        return '—';
    }
  }

  LinearGradient _plantGradient(String? slug) {
    switch (slug) {
      case 'monstera-deliciosa':
        return const LinearGradient(colors: [Color(0xFF4ADE80), Color(0xFF059669)]);
      case 'sirih-gading':
        return const LinearGradient(colors: [Color(0xFFBEF264), Color(0xFF16A34A)]);
      case 'aglonema':
        return const LinearGradient(colors: [Color(0xFFFDA4AF), Color(0xFFE11D48)]);
      case 'lidah-mertua':
        return const LinearGradient(colors: [Color(0xFF34D399), Color(0xFF0D9488)]);
      case 'cabai-rawit':
        return const LinearGradient(colors: [Color(0xFFEF4444), Color(0xFFBE123C)]);
      case 'tomat-cherry':
        return const LinearGradient(colors: [Color(0xFFFB923C), Color(0xFFDC2626)]);
      case 'kemangi':
        return const LinearGradient(colors: [Color(0xFFA3E635), Color(0xFF16A34A)]);
      case 'aloe-vera':
        return const LinearGradient(colors: [Color(0xFF4ADE80), Color(0xFF16A34A)]);
      default:
        return const LinearGradient(colors: [Color(0xFFBBF7D0), Color(0xFF15803D)]);
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
}
