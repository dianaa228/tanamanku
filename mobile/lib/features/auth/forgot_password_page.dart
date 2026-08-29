import 'dart:async';
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

  // Cooldown timer
  static const _cooldownSeconds = 60;
  int _remainingSeconds = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startCooldown() {
    _timer?.cancel();
    setState(() => _remainingSeconds = _cooldownSeconds);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _remainingSeconds--;
          if (_remainingSeconds <= 0) {
            _remainingSeconds = 0;
            timer.cancel();
          }
        });
      } else {
        timer.cancel();
      }
    });
  }

  Future<void> _sendEmail({bool isResend = false}) async {
    if (_emailCtrl.text.isEmpty) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await _service.forgotPassword(_emailCtrl.text.trim());
      if (mounted) {
        setState(() {
          _sent = true;
          _loading = false;
        });
        _startCooldown();
        if (isResend) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Link reset dikirim ulang ✉️')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Email tidak ditemukan.';
          _loading = false;
        });
      }
    }
  }

  String _formatTime(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
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
                style: GoogleFonts.poppins(fontSize: 28, fontWeight: FontWeight.w800, color: AppTheme.leaf950),
              ),
              const SizedBox(height: 8),
              Text(
                'Masukkan email Anda. Kami akan mengirimkan link untuk mereset password.',
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

              // Success state
              if (_sent) ...[
                // Success message
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(16)),
                  child: Column(
                    children: [
                      const Text('✅', style: TextStyle(fontSize: 40)),
                      const SizedBox(height: 8),
                      Text(
                        'Link reset password telah dikirim!',
                        style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.leaf800),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Silakan cek inbox ${_emailCtrl.text}',
                        style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5)),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Cooldown timer
                if (_remainingSeconds > 0)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(14)),
                    child: Column(
                      children: [
                        Text(
                          'Kirim ulang dalam',
                          style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.5)),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _formatTime(_remainingSeconds),
                          style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w800, color: AppTheme.leaf700),
                        ),
                      ],
                    ),
                  )
                else
                  // Resend button
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: _loading ? null : () => _sendEmail(isResend: true),
                      icon: const Icon(Icons.refresh_rounded, size: 18),
                      label: Text(
                        _loading ? 'Mengirim...' : 'Kirim ulang email',
                        style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                    ),
                  ),

                const SizedBox(height: 24),

                // Back to login
                AppButton.secondary(
                  label: 'Kembali ke login',
                  expanded: true,
                  onPressed: () => context.pop(),
                ),
              ] else ...[
                // Email input
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

                // Send button
                AppButton(
                  label: 'Kirim link reset',
                  expanded: true,
                  loading: _loading,
                  onPressed: () => _sendEmail(),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
