import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/app_constants.dart';
import '../../models/user_plant_model.dart';
import '../../services/garden_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/plant_card.dart';

class MyGardenPage extends StatefulWidget {
  const MyGardenPage({super.key});

  @override
  State<MyGardenPage> createState() => _MyGardenPageState();
}

class _MyGardenPageState extends State<MyGardenPage> {
  final _service = GardenService();
  List<UserPlantModel> _plants = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPlants();
  }

  Future<void> _loadPlants() async {
    try {
      final plants = await _service.getMyPlants();
      if (mounted) setState(() { _plants = plants; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final todayReminders = _plants
        .expand((p) => p.reminders.where((r) => r.isActive).map((r) => (reminder: r, plant: p)))
        .toList()
      ..sort((a, b) => (a.reminder.nextDueAt ?? DateTime.now()).compareTo(b.reminder.nextDueAt ?? DateTime.now()));

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: const Text('My Garden 🪴'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: () => _showAddPlantSheet(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadPlants,
        child: _loading
            ? const LoadingWidget(label: 'Memuat kebunmu...')
            : _plants.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text('🪴', style: TextStyle(fontSize: 64)),
                        const SizedBox(height: 16),
                        Text('Kebunmu masih kosong', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 8),
                        Text('Tambahkan tanaman untuk mulai merawat', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                        const SizedBox(height: 20),
                        ElevatedButton.icon(
                          onPressed: () => _showAddPlantSheet(),
                          icon: const Icon(Icons.add, size: 18),
                          label: const Text('Tambah tanaman'),
                        ),
                      ],
                    ),
                  )
                : CustomScrollView(
                    slivers: [
                      // ── Ringkasan kesehatan ──
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                          child: Row(
                            children: [
                              _healthChip('😊', 'Sehat', _count(AppConstants.plantHealthy), AppTheme.leaf600),
                              const SizedBox(width: 8),
                              _healthChip('💧', 'Perlu air', _count(AppConstants.plantNeedsWater), const Color(0xFF0EA5E9)),
                              const SizedBox(width: 8),
                              _healthChip('⚠️', 'Perhatian', _count(AppConstants.plantNeedsAttention), const Color(0xFFF59E0B)),
                            ],
                          ),
                        ),
                      ),

                      // ── Plant grid ──
                      SliverPadding(
                        padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                        sliver: SliverGrid(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 12,
                            crossAxisSpacing: 12,
                            childAspectRatio: 0.72,
                          ),
                          delegate: SliverChildBuilderDelegate(
                            (context, i) => PlantCard(plant: _plants[i]),
                            childCount: _plants.length,
                          ),
                        ),
                      ),

                      // ── Pengingat ──
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('🔔 Pengingat Perawatan', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700)),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: AppTheme.sun300.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(12)),
                                child: Text('${todayReminders.length} aktif', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.sun500)),
                              ),
                            ],
                          ),
                        ),
                      ),

                      SliverPadding(
                        padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
                        sliver: todayReminders.isEmpty
                            ? SliverToBoxAdapter(
                                child: Container(
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    color: AppTheme.leaf50.withValues(alpha: 0.5),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: AppTheme.leaf200, style: BorderStyle.solid),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'Belum ada pengingat. 🌱',
                                      style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5)),
                                    ),
                                  ),
                                ),
                              )
                            : SliverList(
                                delegate: SliverChildBuilderDelegate(
                                  (context, i) {
                                    final item = todayReminders[i];
                                    final days = item.reminder.daysUntilDue;
                                    final overdue = days != null && days <= 0;
                                    final careType = AppConstants.careTypes[item.reminder.type] ?? item.reminder.type;

                                    return Container(
                                      margin: const EdgeInsets.only(bottom: 8),
                                      padding: const EdgeInsets.all(14),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(14),
                                        border: Border.all(color: overdue ? const Color(0xFFEF4444).withValues(alpha: 0.3) : AppTheme.leaf100),
                                      ),
                                      child: Row(
                                        children: [
                                          Text(item.plant.species?.name.substring(0, 1) ?? '🌱', style: const TextStyle(fontSize: 24)),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  '${item.plant.nickname} · $careType',
                                                  style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600),
                                                ),
                                                Text(
                                                  overdue ? 'Jatuh tempo hari ini!' : '$days hari lagi',
                                                  style: GoogleFonts.poppins(
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.w600,
                                                    color: overdue ? const Color(0xFFEF4444) : AppTheme.leaf900.withValues(alpha: 0.5),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          TextButton(
                                            onPressed: () async {
                                              await _service.markReminderDone(item.reminder.id);
                                              _loadPlants();
                                              if (!context.mounted) return;
                                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Selesai dicatat! 💚')));
                                            },
                                            child: Text('✓ Selesai', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.leaf600)),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                  childCount: todayReminders.length,
                                ),
                              ),
                      ),
                    ],
                  ),
      ),
    );
  }

  int _count(String status) => _plants.where((p) => p.status == status).length;

  Widget _healthChip(String icon, String label, int count, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Text(icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 4),
            Text('$count', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800)),
            Text(label, style: GoogleFonts.poppins(fontSize: 10, color: AppTheme.leaf900.withValues(alpha: 0.5))),
          ],
        ),
      ),
    );
  }

  void _showAddPlantSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollCtrl) => Container(
          padding: const EdgeInsets.all(20),
          child: ListView(
            controller: scrollCtrl,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: AppTheme.leaf200, borderRadius: BorderRadius.circular(2)),
                ),
              ),
              const SizedBox(height: 16),
              Text('Tambahkan tanaman baru 🌱', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700)),
              const SizedBox(height: 16),
              Text(
                'Pilih spesies tanaman yang ingin ditambahkan ke kebunmu.',
                style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6)),
              ),
              const SizedBox(height: 20),
              // Placeholder — nanti diisi dengan species list dari API
              ...List.generate(8, (i) {
                final species = ['Monstera Deliciosa', 'Sirih Gading', 'Aglonema', 'Lidah Mertua', 'Cabai Rawit', 'Tomat Cherry', 'Kemangi', 'Lidah Buaya'];
                final emoji = ['🌿', '🍃', '🪴', '🌵', '🌶️', '🍅', '🌿', '🌵'];
                return ListTile(
                  leading: Text(emoji[i], style: const TextStyle(fontSize: 28)),
                  title: Text(species[i], style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                  subtitle: Text('Ketuk untuk menambah', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('$species[i] ditambahkan! 🌱')),
                    );
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
