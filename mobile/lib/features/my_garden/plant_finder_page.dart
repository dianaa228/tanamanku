import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/plant_emoji.dart';
import 'garden_provider.dart';
import '../../widgets/loading_widget.dart';

class PlantFinderPage extends StatefulWidget {
  const PlantFinderPage({super.key});

  @override
  State<PlantFinderPage> createState() => _PlantFinderPageState();
}

class _PlantFinderPageState extends State<PlantFinderPage> {
  int _step = 0;
  Map<String, dynamic> _answers = {};
  List<Map<String, dynamic>> _questions = [];
  bool _questionsLoaded = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final garden = context.read<GardenProvider>();
      final qs = await garden.loadFinderQuestions();
      if (mounted && qs.isNotEmpty) {
        setState(() { _questions = qs; _questionsLoaded = true; });
      } else if (mounted) {
        setState(() { _questions = _defaultQuestions; _questionsLoaded = true; });
      }
    });
  }

  Future<void> _choose(GardenProvider garden, dynamic value) async {
    final q = _questions[_step];
    final next = {..._answers, q['id'] as String: value};
    setState(() => _answers = next);
    if (_step < _questions.length - 1) { setState(() => _step++); return; }
    final answers = next.map((k, v) => MapEntry(k, v.toString()));
    await garden.getRecommendation(answers);
  }

  @override
  Widget build(BuildContext context) {
    final garden = context.watch<GardenProvider>();
    final progress = _questions.isEmpty ? 0.0 : ((_step + (garden.recommendations.isNotEmpty ? 1 : 0)) / _questions.length) * 100;

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('Plant Finder 💡')),
      body: !_questionsLoaded
          ? const LoadingWidget()
          : garden.recommendations.isNotEmpty
              ? _buildResults(garden)
              : garden.loading
                  ? const LoadingWidget(label: 'Menganalisis lingkungan...')
                  : _buildQuiz(garden, progress),
    );
  }

  Widget _buildQuiz(GardenProvider garden, double progress) {
    final q = _questions[_step];
    return Padding(padding: const EdgeInsets.all(20), child: Column(children: [
      ClipRRect(borderRadius: BorderRadius.circular(6), child: LinearProgressIndicator(value: progress / 100, backgroundColor: AppTheme.leaf100, valueColor: const AlwaysStoppedAnimation(AppTheme.leaf600), minHeight: 6)),
      const SizedBox(height: 6),
      Text('Langkah ${_step + 1} dari ${_questions.length}', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
      const Spacer(),
      Text(q['icon'] ?? '❓', style: const TextStyle(fontSize: 48)),
      const SizedBox(height: 16),
      Text(q['question'] ?? '', textAlign: TextAlign.center, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.leaf950)),
      const SizedBox(height: 32),
      ...(q['options'] as List<dynamic>? ?? []).map((opt) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: GestureDetector(
          onTap: () => _choose(garden, opt['value']),
          child: Container(width: double.infinity, padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf200)),
            child: Row(children: [
              Text(opt['icon'] ?? '🌱', style: const TextStyle(fontSize: 28)), const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(opt['label'] ?? '', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
                if (opt['desc'] != null) Text(opt['desc'], style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
              ])),
              Icon(Icons.chevron_right_rounded, color: AppTheme.leaf900.withValues(alpha: 0.3)),
            ]),
          ),
        ),
      )),
      TextButton(onPressed: _step > 0 ? () => setState(() => _step--) : null, child: Text('← Kembali', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5)))),
      const Spacer(flex: 2),
    ]));
  }

  Widget _buildResults(GardenProvider garden) {
    return SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(children: [
      Container(width: double.infinity, padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(20)),
        child: Column(children: [
          const Text('🎯', style: TextStyle(fontSize: 40)), const SizedBox(height: 8),
          Text('Tanaman terbaik untukmu', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(_answers.values.join(' · '), style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)), textAlign: TextAlign.center),
        ])),
      const SizedBox(height: 16),
      ...garden.recommendations.asMap().entries.map((entry) {
        final i = entry.key; final s = entry.value;
        return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: i == 0 ? AppTheme.leaf400 : AppTheme.leaf100, width: i == 0 ? 2 : 1)),
          child: Row(children: [
            Text(plantEmoji(name: s.name, slug: s.slug), style: const TextStyle(fontSize: 36)), const SizedBox(width: 16),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (i == 0) Text('🥇 Paling cocok', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.sun500)),
              Text(s.name, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700)),
              Text(s.scientificName ?? '', style: GoogleFonts.poppins(fontSize: 10, fontStyle: FontStyle.italic, color: AppTheme.leaf900.withValues(alpha: 0.4))),
            ])),
          ]));
      }),
      const SizedBox(height: 20),
      Row(children: [
        Expanded(child: OutlinedButton(onPressed: () => setState(() { _step = 0; _answers = {}; garden.resetDiagnosis(); }), child: const Text('↻ Ulangi'))),
        const SizedBox(width: 12),
        Expanded(child: ElevatedButton(onPressed: () => context.push('/explore'), child: const Text('Jelajahi'))),
      ]),
    ]));
  }

  static const _defaultQuestions = [
    {'id': 'lokasi', 'question': 'Di mana tanaman akan diletakkan?', 'icon': '🏠', 'options': [
      {'value': 'indoor-terang', 'label': 'Dalam ruangan terang', 'icon': '🪟'}, {'value': 'indoor-redup', 'label': 'Dalam ruangan redup', 'icon': '🛋️'},
      {'value': 'outdoor', 'label': 'Balkon / halaman', 'icon': '🌤️'}, {'value': 'teras', 'label': 'Teras semi-terbuka', 'icon': '🏡'},
    ]},
    {'id': 'pengalaman', 'question': 'Seberapa berpengalaman Anda?', 'icon': '🧑‍🌾', 'options': [
      {'value': 'pemula', 'label': 'Pemula', 'icon': '🌱'}, {'value': 'sedang', 'label': 'Menengah', 'icon': '🌿'}, {'value': 'mahir', 'label': 'Mahir', 'icon': '🪴'},
    ]},
    {'id': 'tujuan', 'question': 'Apa tujuan utama Anda?', 'icon': '🎯', 'options': [
      {'value': 'hias', 'label': 'Mempercantik ruangan', 'icon': '🪴'}, {'value': 'pangan', 'label': 'Panen sayur / buah', 'icon': '🥬'},
      {'value': 'udara', 'label': 'Membersihkan udara', 'icon': '💨'}, {'value': 'relaksasi', 'label': 'Hobi & relaksasi', 'icon': '🧘'},
    ]},
    {'id': 'waktu', 'question': 'Waktu merawat per minggu?', 'icon': '⏰', 'options': [
      {'value': 'sibuk', 'label': 'Sangat sibuk (<15 menit)', 'icon': '⚡'}, {'value': 'normal', 'label': 'Cukup (15–45 menit)', 'icon': '☀️'},
      {'value': 'banyak', 'label': 'Santai (45+ menit)', 'icon': '🌻'},
    ]},
  ];
}
