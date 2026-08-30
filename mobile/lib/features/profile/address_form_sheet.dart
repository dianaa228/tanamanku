import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../models/address_model.dart';
import '../../services/address_service.dart';

/// Form tambah / edit alamat (bottom sheet).
class AddressFormSheet extends StatefulWidget {
  final AddressService service;
  final AddressModel? existing;

  const AddressFormSheet({super.key, required this.service, this.existing});

  @override
  State<AddressFormSheet> createState() => _AddressFormSheetState();
}

class _AddressFormSheetState extends State<AddressFormSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _label;
  late final TextEditingController _recipient;
  late final TextEditingController _phone;
  late final TextEditingController _province;
  late final TextEditingController _city;
  late final TextEditingController _district;
  late final TextEditingController _street;
  late final TextEditingController _postal;
  bool _default = false;
  bool _saving = false;

  bool get _isEdit => widget.existing != null;

  @override
  void initState() {
    super.initState();
    final a = widget.existing;
    _label = TextEditingController(text: a?.label ?? '');
    _recipient = TextEditingController(text: a?.recipient ?? '');
    _phone = TextEditingController(text: a?.phone ?? '');
    _province = TextEditingController(text: a?.province ?? '');
    _city = TextEditingController(text: a?.city ?? '');
    _district = TextEditingController(text: a?.district ?? '');
    _street = TextEditingController(text: a?.street ?? '');
    _postal = TextEditingController(text: a?.postalCode ?? '');
    _default = a?.isDefault ?? false;
  }

  @override
  void dispose() {
    _label.dispose();
    _recipient.dispose();
    _phone.dispose();
    _province.dispose();
    _city.dispose();
    _district.dispose();
    _street.dispose();
    _postal.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    final address = AddressModel(
      id: widget.existing?.id,
      label: _label.text.trim(),
      recipient: _recipient.text.trim(),
      phone: _phone.text.trim(),
      province: _province.text.trim(),
      city: _city.text.trim(),
      district: _district.text.trim(),
      street: _street.text.trim(),
      postalCode: _postal.text.trim(),
      isDefault: _default,
    );
    try {
      if (_isEdit) {
        await widget.service.update(address);
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alamat diperbarui ✅')));
      } else {
        await widget.service.create(address);
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alamat ditambahkan ✅')));
      }
      if (mounted) Navigator.of(context).pop();
    } catch (_) {
      if (mounted) {
        setState(() => _saving = false);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gagal menyimpan alamat. Coba lagi.')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.of(context).viewInsets.bottom;

    return Padding(
      padding: EdgeInsets.only(bottom: bottom),
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Text(_isEdit ? 'Edit Alamat' : 'Tambah Alamat', style: GoogleFonts.poppins(fontSize: 17, fontWeight: FontWeight.w700))),
              const SizedBox(height: 16),
              _field(_label, 'Label', hint: 'Rumah / Kantor', icon: Icons.label_outline_rounded),
              _field(_recipient, 'Nama penerima *', icon: Icons.person_outline_rounded),
              _field(_phone, 'No. HP *', icon: Icons.phone_outlined, keyboard: TextInputType.phone),
              _field(_province, 'Provinsi *', icon: Icons.map_outlined),
              _field(_city, 'Kota / Kabupaten *', icon: Icons.location_city_outlined),
              _field(_district, 'Kecamatan *', icon: Icons.place_outlined),
              _field(_street, 'Alamat lengkap *', icon: Icons.home_outlined, maxLines: 3),
              _field(_postal, 'Kode pos', icon: Icons.numbers_outlined, keyboard: TextInputType.number),
              const SizedBox(height: 8),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                value: _default,
                onChanged: (v) => setState(() => _default = v),
                title: Text('Jadikan alamat utama', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                activeColor: AppTheme.leaf600,
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _saving ? null : _submit,
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.leaf600, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                  child: Text(_saving ? 'Menyimpan...' : 'Simpan', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(TextEditingController c, String label, {String? hint, IconData? icon, int maxLines = 1, TextInputType? keyboard}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: c,
        maxLines: maxLines,
        keyboardType: keyboard,
        validator: (v) => (v == null || v.trim().isEmpty) ? 'Wajib diisi' : null,
        style: GoogleFonts.poppins(fontSize: 13),
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: icon != null ? Icon(icon, size: 20) : null,
          filled: true,
          fillColor: AppTheme.leaf50.withValues(alpha: 0.4),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.leaf200)),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.leaf200)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.leaf500, width: 1.5)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        ),
      ),
    );
  }
}
