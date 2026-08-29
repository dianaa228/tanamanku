import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/seller_service.dart';
import '../../services/product_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';

class SellerCreateProductPage extends StatefulWidget {
  const SellerCreateProductPage({super.key});
  @override
  State<SellerCreateProductPage> createState() => _SellerCreateProductPageState();
}

class _SellerCreateProductPageState extends State<SellerCreateProductPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _stockCtrl = TextEditingController();
  String _careLevel = 'mudah';
  int? _categoryId;
  List<dynamic> _categories = [];
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    try {
      _categories = await ProductService().getCategories();
      setState(() {});
    } catch (_) {}
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      await SellerService().createProduct({
        'name': _nameCtrl.text.trim(),
        'description': _descCtrl.text.trim(),
        'price': int.tryParse(_priceCtrl.text) ?? 0,
        'stock': int.tryParse(_stockCtrl.text) ?? 0,
        'care_level': _careLevel,
        'category_id': _categoryId,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Produk dibuat! ✅')));
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
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('➕ Tambah Produk')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            AppTextField(label: 'Nama Produk *', controller: _nameCtrl, hint: 'Contoh: Monstera Deliciosa 60cm'),
            const SizedBox(height: 16),
            AppTextField(label: 'Deskripsi', controller: _descCtrl, hint: 'Deskripsi produk...', maxLines: 3),
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: AppTextField(label: 'Harga (Rp) *', controller: _priceCtrl, keyboardType: TextInputType.number)),
              const SizedBox(width: 12),
              Expanded(child: AppTextField(label: 'Stok *', controller: _stockCtrl, keyboardType: TextInputType.number)),
            ]),
            const SizedBox(height: 16),
            Text('Kategori', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppTheme.leaf200)),
              child:              DropdownButton<dynamic>(
                value: _categoryId, isExpanded: true, underline: const SizedBox(),
                hint: Text('Pilih kategori', style: GoogleFonts.poppins()),
                items: _categories.map((c) => DropdownMenuItem(value: c['id'] as dynamic, child: Text('${c['icon'] ?? ''} ${c['name'] ?? ''}', style: GoogleFonts.poppins()))).toList(),
                onChanged: (v) => setState(() => _categoryId = v as int?),
              ),
            ),
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
            AppButton(label: 'Simpan Produk', expanded: true, loading: _loading, onPressed: _submit),
          ]),
        ),
      ),
    );
  }
}
