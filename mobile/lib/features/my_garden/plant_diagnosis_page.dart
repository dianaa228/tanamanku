import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/garden_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/loading_widget.dart';

class PlantDiagnosisPage extends StatefulWidget {
  const PlantDiagnosisPage({super.key});

  @override
  State<PlantDiagnosisPage> createState() => _PlantDiagnosisPageState();
}

class _PlantDiagnosisPageState extends State<PlantDiagnosisPage> {
  final _service = GardenService();
  List<String> _selected = [];
  Map<String, dynamic>? _result;
  bool _loading = false;

  static const _symptoms = [
    {'id': 'daun-kuning', 'label': 'Daun menguning', 'icon': '🍂'},
    {'id': 'daun-layu', 'label': 'Daun lemas / layu', 'icon': '🥀'},
    {'id': 'tanah-basah', 'label': 'Tanah selalu basah', 'icon': '🫧'},
    {'id': 'daun-kering', 'label': 'Daun kering & rapuh', 'icon': '🍃'},
    {'id': 'ujung-coklat', 'label': 'Ujung daun coklat', 'icon': '🤎'},
    {'id': 'daun-menggulung', 'label': 'Daun menggulung', 'icon': '🌀'},
    {'id': 'bercak-putih', 'label': 'Bercak / serbuk putih', 'icon': '⚪'},
    {'id': 'daun-keriting', 'label': 'Daun keriting', 'icon': '🥬'},
    {'id': 'lubang-daun', 'label': 'Ada lubang di daun', 'icon': '🕳️'},
    {'id': 'kutu-hijau', 'label': 'Kutu kecil di daun', 'icon': '🦗'},
    {'id': 'garis-perak', 'label': 'Garis perak keperakan', 'icon': '✨'},
    {'id': 'daun-pucat', 'label': 'Daun pucat / pudar', 'icon': '🎨'},
    {'id': 'pertumbuhan-lambat', 'label': 'Tumbuh lambat', 'icon': '🐢'},
    {'id': 'daun-kuning-bawah', 'label': 'Daun bawah menguning', 'icon': '⬇️'},
  ];

  void _toggle(String id) {
    setState(() {
      _selected.contains(id) ? _selected.remove(id) : _selected.add(id);
    });
  }

  Future<void> _diagnose() async {
    if (_selected.isEmpty) return;
    setState(() => _loading = true);
    try {
      final result = await _service.diagnose(null, _selected);
      if (mounted) setState(() { _result = result; _loading = false; });
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('Plant Diagnosis 🩺')),
      body: _result != null ? _buildResult() : _buildSymptoms(),
    );
  }

  Widget _buildSymptoms() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // Header
          Text('Tanamanmu kenapa? 🤔', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text(
            'Pilih gejala yang terlihat pada tanamanmu',
            style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withOpacity(0.5)),
            textAlign: TextAlign.center,
          ),

          const SizedBox(height: 20),

          // Gejala grid
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                childAspectRatio: 0.9,
              ),
              itemCount: _symptoms.length,
              itemBuilder: (context, i) {
                final s = _symptoms[i];
                final active = _selected.contains(s['id']);
                return GestureDetector(
                  onTap: () => _toggle(s['id'] as String),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: active ? AppTheme.leaf50 : Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: active ? AppTheme.leaf600 : AppTheme.leaf100,
                        width: active ? 2 : 1,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(s['icon'] as String, style: TextStyle(fontSize: active ? 26 : 24)),
                        const SizedBox(height: 4),
                        Text(
                          s['label'] as String,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: active ? AppTheme.leaf800 : AppTheme.leaf900.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Tombol diagnosa
          if (_selected.isNotEmpty)
            Text('${_selected.length} gejala dipilih', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withOpacity(0.5))),
          const SizedBox(height: 8),
          AppButton(
            label: '🔍 Diagnosa tanaman',
            expanded: true,
            loading: _loading,
            onPressed: _selected.isEmpty ? null : _diagnose,
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }

  Widget _buildResult() {
    final severity = _result!['severity'] ?? 'ringan';
    final title = _result!['diagnosis'] ?? '—';
    final advice = (_result!['advice'] as List<dynamic>?) ?? [];
    final severityColor = severity == 'berat'
        ? const Color(0xFFEF4444)
        : severity == 'sedang'
            ? AppTheme.sun500
            : AppTheme.leaf600;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: severityColor.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Text(severity == 'berat' ? '⚠️' : severity == 'sedang' ? '🩺' : '🌱', style: const TextStyle(fontSize: 48)),
                const SizedBox(height: 8),
                Text(title, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(color: severityColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                  child: Text(
                    'Tingkat: $severity',
                    style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: severityColor),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Advice
          if (advice.isNotEmpty) ...[
            Text('✅ Langkah penanganan', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            ...advice.asMap().entries.map((entry) {
              final i = entry.key;
              final a = entry.value.toString();
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: AppTheme.leaf50.withOpacity(0.7), borderRadius: BorderRadius.circular(14)),
                child: Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(color: AppTheme.leaf600, shape: BoxShape.circle),
                      child: Center(child: Text('${i + 1}', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white))),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Text(a, style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withOpacity(0.8)))),
                  ],
                ),
              );
            }),
          ],

          const SizedBox(height: 24),

          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() { _selected = []; _result = null; }),
                  child: const Text('↻ Diagnosis ulang'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {/* Navigate to shop */},
                  child: const Text('Beli solusi 🛒'),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          Text(
            '⚠️ Diagnosis ini bersifat awal. Untuk kepastian, konsultasikan dengan ahli tanaman.',
            style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withOpacity(0.4)),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
