import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.light),
      child: Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF16A34A), Color(0xFF15803D), Color(0xFF166534)],
            ),
          ),
          child: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),
                  // Logo
                  Container(
                    width: 56, height: 56,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                    ),
                    child: const Center(child: Text('🌱', style: TextStyle(fontSize: 28))),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Daftar gratis 🌿',
                    style: GoogleFonts.plusJakartaSans(fontSize: 28, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Mulai perjalanan berkebunmu hari ini.',
                    style: GoogleFonts.plusJakartaSans(fontSize: 14, color: Colors.white.withValues(alpha: 0.7)),
                  ),
                  const SizedBox(height: 32),

                  // Form Card
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.95),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 24, offset: const Offset(0, 8)),
                      ],
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (auth.error != null) ...[
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(14)),
                              child: Text(auth.error!, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFFDC2626))),
                            ),
                            const SizedBox(height: 16),
                          ],
                          AppTextField(label: 'Nama Lengkap', controller: _nameCtrl, prefixIcon: Icons.person_outline, hint: 'Nama kamu'),
                          const SizedBox(height: 16),
                          AppTextField(label: 'Email', controller: _emailCtrl, prefixIcon: Icons.email_outlined, hint: 'nama@email.com', keyboardType: TextInputType.emailAddress),
                          const SizedBox(height: 16),
                          AppTextField(
                            label: 'Password', controller: _passCtrl, prefixIcon: Icons.lock_outline, obscure: _obscure,
                            hint: '••••••••',
                            suffix: IconButton(
                              icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20, color: AppTheme.leaf400),
                              onPressed: () => setState(() => _obscure = !_obscure),
                            ),
                          ),
                          const SizedBox(height: 16),
                          AppTextField(label: 'Konfirmasi Password', controller: _confirmCtrl, prefixIcon: Icons.lock_outline, obscure: true, hint: '••••••••'),
                          const SizedBox(height: 24),
                          AppButton(
                            label: 'Daftar',
                            expanded: true,
                            loading: auth.loading,
                            onPressed: () async {
                              if (!_formKey.currentState!.validate()) return;
                              if (_passCtrl.text != _confirmCtrl.text) {
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Password tidak cocok')));
                                return;
                              }
                              final ok = await auth.register(name: _nameCtrl.text.trim(), email: _emailCtrl.text.trim(), password: _passCtrl.text);
                              if (ok && context.mounted) context.go('/');
                            },
                          ),
                        ],
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
                          style: GoogleFonts.plusJakartaSans(fontSize: 14, color: Colors.white.withValues(alpha: 0.7)),
                          children: [TextSpan(text: 'Masuk', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, color: Colors.white))],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
