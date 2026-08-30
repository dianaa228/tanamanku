import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../models/address_model.dart';
import '../../services/address_service.dart';
import '../auth/auth_provider.dart';
import 'address_form_sheet.dart';

/// Buku Alamat — list, tambah, edit (menyesuaikan web /alamat).
class AddressPage extends StatefulWidget {
  const AddressPage({super.key});

  @override
  State<AddressPage> createState() => _AddressPageState();
}

class _AddressPageState extends State<AddressPage> {
  final _service = AddressService();
  late Future<void> _loadFuture;

  @override
  void initState() {
    super.initState();
    _loadFuture = _reload();
  }

  Future<void> _reload() async {
    final auth = context.read<AuthProvider>();
    await auth.refresh();
  }

  Future<void> _openForm([AddressModel? existing]) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => AddressFormSheet(service: _service, existing: existing),
    );
    setState(() => _loadFuture = _reload());
  }

  Future<void> _setDefault(AddressModel a) async {
    if (a.isDefault) return;
    try {
      await _service.update(a.copyWith(isDefault: true));
      await _reload();
      setState(() {});
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alamat utama diperbarui ✅')));
      }
    } catch (_) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gagal mengubah alamat utama')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final addresses = auth.user?.addresses ?? const <AddressModel>[];

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.dark),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        appBar: AppBar(
          title: Text('Alamat Saya', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
          actions: [
            IconButton(
              icon: const Icon(Icons.add_rounded),
              tooltip: 'Tambah alamat',
              onPressed: () => _openForm(),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => _openForm(),
          backgroundColor: AppTheme.leaf600,
          foregroundColor: Colors.white,
          icon: const Icon(Icons.add_rounded),
          label: Text('Tambah Alamat', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
        ),
        body: FutureBuilder<void>(
          future: _loadFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (addresses.isEmpty) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('📍', style: TextStyle(fontSize: 56)),
                    const SizedBox(height: 16),
                    Text('Belum ada alamat', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Text('Tambahkan alamat agar bisa checkout', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.muted)),
                    const SizedBox(height: 20),
                    ElevatedButton(onPressed: () => _openForm(), child: const Text('Tambah alamat')),
                  ],
                ),
              );
            }
            return ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
              itemCount: addresses.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, i) {
                final a = addresses[i];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: a.isDefault ? AppTheme.leaf400 : AppTheme.leaf100, width: a.isDefault ? 1.5 : 1),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(a.label, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                          const SizedBox(width: 8),
                          if (a.isDefault)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(8)),
                              child: Text('Utama', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.leaf700)),
                            ),
                          const Spacer(),
                          InkWell(
                            onTap: () => _setDefault(a),
                            child: Icon(Icons.star_rounded, size: 22, color: a.isDefault ? AppTheme.sun400 : AppTheme.leaf200),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('${a.recipient} · ${a.phone}', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 4),
                      Text('${a.street}\n${a.district}, ${a.city}, ${a.province}${a.postalCode.isEmpty ? '' : ' ${a.postalCode}'}',
                          style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.muted, height: 1.5)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          TextButton.icon(
                            onPressed: () => _openForm(a),
                            icon: const Icon(Icons.edit_rounded, size: 16),
                            label: const Text('Edit'),
                            style: TextButton.styleFrom(foregroundColor: AppTheme.leaf700),
                          ),
                          if (!a.isDefault)
                            TextButton.icon(
                              onPressed: () => _setDefault(a),
                              icon: const Icon(Icons.star_outline_rounded, size: 16),
                              label: const Text('Jadikan utama'),
                              style: TextButton.styleFrom(foregroundColor: AppTheme.leaf700),
                            ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
