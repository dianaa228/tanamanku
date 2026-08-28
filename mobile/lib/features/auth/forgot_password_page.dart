import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/auth_service.dart' as svc;
import '../../core/theme/app_theme.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _emailCtrl = TextEditingController();
  final _service = svc.AuthService();
  bool _loading = false;
  bool _sent = false;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Text(
                'Lupa password? 🔑',
                style: GoogleFonts.poppins(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.leaf950,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Masukkan email Anda. Kami akan mengirimkan link untuk mereset password.',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  color: AppTheme.leaf900.withValues(alpha: 0.6),
                ),
              ),

              const SizedBox(height: 40),

              if (_error != null) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(_error!, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFFDC2626))),
                ),
                const SizedBox(height: 16),
              ],

              if (_sent) ...[
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.leaf50,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    '✅ Link reset password telah dikirim ke ${_emailCtrl.text}. Silakan cek inbox Anda.',
                    style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf800),
                  ),
                ),
                const SizedBox(height: 24),
                AppButton.secondary(
                  label: 'Kembali ke login',
                  expanded: true,
                  onPressed: () => context.pop(),
                ),
              ] else ...[
                AppTextField(
                  label: 'Email',
                  hint: 'nama@email.com',
                  prefixIcon: Icons.email_outlined,
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  autofocus: true,
                  validator: (v) => (v == null || v.isEmpty) ? 'Email wajib diisi' : null,
                ),
                const SizedBox(height: 24),
                AppButton(
                  label: 'Kirim link reset',
                  expanded: true,
                  loading: _loading,
                  onPressed: () async {
                    if (_emailCtrl.text.isEmpty) return;
                    setState(() {
                      _loading = true;
                      _error = null;
                    });
                    try {
                      await _service.forgotPassword(_emailCtrl.text.trim());
                      setState(() {
                        _sent = true;
                        _loading = false;
                      });
                    } catch (e) {
                      setState(() {
                        _error = 'Email tidak ditemukan.';
                        _loading = false;
                      });
                    }
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
