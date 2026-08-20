import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';
import 'auth_provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController(text: 'rina@tanamanku.id');
  final _passCtrl = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
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

                // Header
                Text(
                  'Selamat datang kembali 👋',
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.leaf950,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Masuk untuk lanjut merawat kebunmu.',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: AppTheme.leaf900.withOpacity(0.6),
                  ),
                ),

                const SizedBox(height: 40),

                // Error message
                if (auth.error != null) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      auth.error!,
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFFDC2626),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Email
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

                // Password
                AppTextField(
                  label: 'Password',
                  hint: '••••••••',
                  prefixIcon: Icons.lock_outline,
                  suffix: IconButton(
                    icon: Icon(
                      _obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      size: 20,
                      color: AppTheme.leaf900.withOpacity(0.4),
                    ),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  ),
                  controller: _passCtrl,
                  obscure: _obscure,
                  textInputAction: TextInputAction.done,
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Password wajib diisi';
                    return null;
                  },
                ),

                const SizedBox(height: 12),

                // Lupa password
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => context.push('/forgot-password'),
                    child: Text(
                      'Lupa password?',
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.leaf700,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Tombol masuk
                AppButton(
                  label: 'Masuk',
                  expanded: true,
                  loading: auth.loading,
                  onPressed: () async {
                    if (!_formKey.currentState!.validate()) return;
                    final ok = await auth.login(
                      _emailCtrl.text.trim(),
                      _passCtrl.text,
                    );
                    if (ok && context.mounted) {
                      context.go('/');
                    }
                  },
                ),

                const SizedBox(height: 16),

                // Demo hint
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.leaf50,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    '💡 Mode demo: email sudah terisi — cukup isi password apa pun lalu klik Masuk.',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: AppTheme.leaf900.withOpacity(0.6),
                    ),
                  ),
                ),

                const SizedBox(height: 40),

                // Link register
                Center(
                  child: TextButton(
                    onPressed: () => context.push('/register'),
                    child: Text.rich(
                      TextSpan(
                        text: 'Belum punya akun? ',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: AppTheme.leaf900.withOpacity(0.6),
                        ),
                        children: [
                          TextSpan(
                            text: 'Daftar gratis',
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.w700,
                              color: AppTheme.leaf700,
                            ),
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
