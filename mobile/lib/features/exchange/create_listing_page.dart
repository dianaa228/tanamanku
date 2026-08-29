import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';
import '../../services/exchange_service.dart';

class CreateListingPage extends StatefulWidget {
  const CreateListingPage({super.key});
  @override
  State<CreateListingPage> createState() => _CreateListingPageState();
}

class _CreateListingPageState extends State<CreateListingPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  String _type = 'sell';
  bool _loading = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    _priceCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      await ExchangeService().createListing(
        title: _nameCtrl.text.trim(),
        description: _descCtrl.text.trim(),
        type: _type,
        price: _type == 'sell' ? (double.tryParse(_priceCtrl.text) ?? 0) : null,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Listing dibuat! 🌱')));
        context.pop();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('📦 Buat Listing')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Jual atau Tukar Tanaman', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700)),
            const SizedBox(height: 20),
            AppTextField(label: 'Nama Tanaman', controller: _nameCtrl, hint: 'Contoh: Monstera Deliciosa'),
            const SizedBox(height: 16),
            AppTextField(label: 'Deskripsi', controller: _descCtrl, hint: 'Deskripsi tanaman...', maxLines: 3),
            const SizedBox(height: 16),
            Text('Tipe', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Row(children: [
              _typeChip('Jual', 'sell'), const SizedBox(width: 8), _typeChip('Tukar', 'exchange'),
            ]),
            const SizedBox(height: 16),
            if (_type == 'sell')
              AppTextField(label: 'Harga (Rp)', controller: _priceCtrl, keyboardType: TextInputType.number, hint: '0'),
            const SizedBox(height: 24),
            AppButton(label: 'Buat Listing', expanded: true, loading: _loading, onPressed: _submit),
          ]),
        ),
      ),
    );
  }

  Widget _typeChip(String label, String value) {
    final selected = _type == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _type = value),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: selected ? AppTheme.leaf600 : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
          ),
          child: Center(child: Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900))),
        ),
      ),
    );
  }
}
