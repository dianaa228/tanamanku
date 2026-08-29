import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/seller_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';

class SellerEditProductPage extends StatefulWidget {
  final int productId;
  const SellerEditProductPage({super.key, required this.productId});
  @override
  State<SellerEditProductPage> createState() => _SellerEditProductPageState();
}

class _SellerEditProductPageState extends State<SellerEditProductPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _stockCtrl = TextEditingController();
  String _careLevel = 'mudah';
  bool _loading = false;
  bool _fetching = true;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    try {
      final products = await SellerService().getProducts();
      final p = products.firstWhere((x) => x['id'] == widget.productId, orElse: () => null);
      if (p != null) {
        _nameCtrl.text = p['name'] ?? '';
        _descCtrl.text = p['description'] ?? '';
        _priceCtrl.text = '${p['price'] ?? 0}';
        _stockCtrl.text = '${p['stock'] ?? 0}';
        _careLevel = p['care_level'] ?? 'mudah';
      }
    } catch (_) {}
    setState(() => _fetching = false);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      await SellerService().updateProduct(widget.productId, {
        'name': _nameCtrl.text.trim(),
        'description': _descCtrl.text.trim(),
        'price': int.tryParse(_priceCtrl.text) ?? 0,
        'stock': int.tryParse(_stockCtrl.text) ?? 0,
        'care_level': _careLevel,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Produk diperbarui! ✅')));
        context.pop();
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    _priceCtrl.dispose();
    _stockCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_fetching) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('✏️ Edit Produk')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            AppTextField(label: 'Nama Produk *', controller: _nameCtrl),
            const SizedBox(height: 16),
            AppTextField(label: 'Deskripsi', controller: _descCtrl, maxLines: 3),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: AppTextField(label: 'Harga (Rp) *', controller: _priceCtrl, keyboardType: TextInputType.number)),
              const SizedBox(width: 12),
              Expanded(child: AppTextField(label: 'Stok *', controller: _stockCtrl, keyboardType: TextInputType.number)),
            ]),
            const SizedBox(height: 16),
            Text('Level Perawatan', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Row(children: ['mudah', 'sedang', 'sulit'].map((l) => Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _careLevel = l),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _careLevel == l ? AppTheme.leaf600 : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: _careLevel == l ? AppTheme.leaf600 : AppTheme.leaf200),
                  ),
                  child: Center(child: Text(l, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: _careLevel == l ? Colors.white : AppTheme.leaf900))),
                ),
              ),
            )).toList()),
            const SizedBox(height: 24),
            AppButton(label: 'Simpan Perubahan', expanded: true, loading: _loading, onPressed: _submit),
          ]),
        ),
      ),
    );
  }
}
