import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';
import 'auth_provider.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),

                Text(
                  'Mulai berkebun 🪴',
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.leaf950,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Gratis selamanya. Tanpa kartu kredit.',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: AppTheme.leaf900.withOpacity(0.6),
                  ),
                ),

                const SizedBox(height: 40),

                if (auth.error != null) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(auth.error!, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFFDC2626))),
                  ),
                  const SizedBox(height: 16),
                ],

                AppTextField(
                  label: 'Nama lengkap',
                  hint: 'Rina Kartika',
                  prefixIcon: Icons.person_outline,
                  controller: _nameCtrl,
                  validator: (v) => (v == null || v.isEmpty) ? 'Nama wajib diisi' : null,
                ),
                const SizedBox(height: 16),

                AppTextField(
                  label: 'Email',
                  hint: 'nama@email.com',
                  prefixIcon: Icons.email_outlined,
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Email wajib diisi';
                    if (!v.contains('@')) return 'Format email tidak valid';
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                AppTextField(
                  label: 'Password',
                  hint: 'Minimal 8 karakter',
                  prefixIcon: Icons.lock_outline,
                  controller: _passCtrl,
                  obscure: _obscure,
                  hintBelow: 'Gunakan kombinasi huruf dan angka agar lebih aman.',
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Password wajib diisi';
                    if (v.length < 8) return 'Minimal 8 karakter';
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                AppTextField(
                  label: 'Konfirmasi password',
                  hint: 'Ulangi password',
                  prefixIcon: Icons.lock_outline,
                  controller: _confirmCtrl,
                  obscure: true,
                  textInputAction: TextInputAction.done,
                  validator: (v) {
                    if (v != _passCtrl.text) return 'Konfirmasi password tidak cocok';
                    return null;
                  },
                ),

                const SizedBox(height: 32),

                AppButton(
                  label: 'Daftar sekarang',
                  expanded: true,
                  loading: auth.loading,
                  onPressed: () async {
                    if (!_formKey.currentState!.validate()) return;
                    final ok = await auth.register(
                      name: _nameCtrl.text.trim(),
                      email: _emailCtrl.text.trim(),
                      password: _passCtrl.text,
                    );
                    if (ok && context.mounted) {
                      context.go('/');
                    }
                  },
                ),

                const SizedBox(height: 16),

                Center(
                  child: Text(
                    'Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      color: AppTheme.leaf900.withOpacity(0.5),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                Center(
                  child: TextButton(
                    onPressed: () => context.push('/login'),
                    child: Text.rich(
                      TextSpan(
                        text: 'Sudah punya akun? ',
                        style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf900.withOpacity(0.6)),
                        children: [
                          TextSpan(
                            text: 'Masuk',
                            style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppTheme.leaf700),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
