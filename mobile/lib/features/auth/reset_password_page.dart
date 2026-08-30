import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_button.dart';
import '../../widgets/app_text_field.dart';

/// Halaman Reset Password — diakses dari link di email.
/// Token dan email diambil dari query parameter URL.
class ResetPasswordPage extends StatefulWidget {
  final String? token;
  final String? email;

  const ResetPasswordPage({super.key, this.token, this.email});

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  final _service = AuthService();
  bool _loading = false;
  bool _success = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    if (widget.email != null) _emailCtrl.text = widget.email!;
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    _confirmCtrl.dispose();
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
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),

                // Header
                Text(
                  'Reset password 🔒',
                  style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800, color: AppTheme.leaf950),
                ),
                const SizedBox(height: 8),
                Text(
                  'Masukkan password baru Anda di bawah ini.',
                  style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf900.withValues(alpha: 0.6)),
                ),

                const SizedBox(height: 40),

                // Error message
                if (_error != null) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(16)),
                    child: Text(_error!, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFFDC2626))),
                  ),
                  const SizedBox(height: 16),
                ],

                // Success message
                if (_success) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(16)),
                    child: Column(
                      children: [
                        const Text('✅', style: TextStyle(fontSize: 48)),
                        const SizedBox(height: 12),
                        Text(
                          'Password berhasil diubah!',
                          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.leaf800),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Silakan masuk dengan password baru Anda.',
                          style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  AppButton(
                    label: 'Masuk sekarang',
                    expanded: true,
                    onPressed: () => context.go('/login'),
                  ),
                ] else ...[
                  // Token info
                  if (widget.token == null || widget.token!.isEmpty)
                    ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(16)),
                        child: Text(
                          '⚠️ Token tidak ditemukan. Silakan minta link reset baru dari halaman Lupa Password.',
                          style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFF92400E)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      AppButton.secondary(
                        label: 'Kembali ke Lupa Password',
                        expanded: true,
                        onPressed: () => context.push('/forgot-password'),
                      ),
                    ]
                  else ...[
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

                    // New password (toggle visibility built-in)
                    AppTextField(
                      label: 'Password baru',
                      hint: '••••••••',
                      prefixIcon: Icons.lock_outline,
                      controller: _passCtrl,
                      obscure: true,
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Password wajib diisi';
                        if (v.length < 8) return 'Password minimal 8 karakter';
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // Confirm password (toggle visibility built-in)
                    AppTextField(
                      label: 'Konfirmasi password',
                      hint: '••••••••',
                      prefixIcon: Icons.lock_outline,
                      controller: _confirmCtrl,
                      obscure: true,
                      textInputAction: TextInputAction.done,
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Konfirmasi password wajib diisi';
                        if (v != _passCtrl.text) return 'Password tidak cocok';
                        return null;
                      },
                    ),

                    const SizedBox(height: 32),

                    // Submit button
                    AppButton(
                      label: 'Ubah password',
                      expanded: true,
                      loading: _loading,
                      onPressed: _submit,
                    ),

                    const SizedBox(height: 16),

                    // Back to login
                    Center(
                      child: TextButton(
                        onPressed: () => context.go('/login'),
                        child: Text(
                          'Kembali ke login',
                          style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.leaf700),
                        ),
                      ),
                    ),
                  ],
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (widget.token == null || widget.token!.isEmpty) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      await _service.resetPassword(
        token: widget.token!,
        email: _emailCtrl.text.trim(),
        password: _passCtrl.text,
        passwordConfirmation: _confirmCtrl.text,
      );
      if (mounted) {
        setState(() {
          _success = true;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = _extractError(e);
          _loading = false;
        });
      }
    }
  }

  String _extractError(dynamic e) {
    try {
      if (e is Exception) {
        final dynamic dioError = e;
        if (dioError.response?.data?['message'] != null) {
          return dioError.response!.data['message'] as String;
        }
        if (dioError.response?.data?['errors'] != null) {
          final errors = dioError.response!.data['errors'] as Map;
          if (errors.isNotEmpty) {
            return errors.values.first.toString();
          }
        }
      }
    } catch (_) {}
    return 'Gagal mereset password. Coba lagi.';
  }
}
