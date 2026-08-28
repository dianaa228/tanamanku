import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/nursery_service.dart';
import '../../widgets/loading_widget.dart';

/// Halaman Directory Nursery — browse local plant shops.
class NurseriesPage extends StatefulWidget {
  const NurseriesPage({super.key});

  @override
  State<NurseriesPage> createState() => _NurseriesPageState();
}

class _NurseriesPageState extends State<NurseriesPage> {
  final _service = NurseryService();
  List<NurseryModel> _nurseries = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      _nurseries = await _service.getNurseries();
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: Text('Nursery 🌿', style: GoogleFonts.poppins(fontWeight: FontWeight.w700))),
      body: _loading
          ? const LoadingWidget()
          : _nurseries.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('🏡', style: TextStyle(fontSize: 64)),
                      const SizedBox(height: 16),
                      Text('Belum ada nursery terdaftar', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: _nurseries.length,
                    itemBuilder: (context, i) {
                      final n = _nurseries[i];
                      return GestureDetector(
                        onTap: () => context.push('/nurseries/${n.id}'),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
                          child: Row(
                            children: [
                              Container(
                                width: 56, height: 56,
                                decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(14)),
                                child: const Center(child: Text('🏡', style: TextStyle(fontSize: 28))),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(n.name, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                                    if (n.address != null)
                                      Text(n.address!, style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)), maxLines: 1, overflow: TextOverflow.ellipsis),
                                  ],
                                ),
                              ),
                              const Icon(Icons.chevron_right, color: AppTheme.leaf300),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
