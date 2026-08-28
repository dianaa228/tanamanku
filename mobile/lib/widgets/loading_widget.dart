import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_theme.dart';

/// Loading spinner dengan label opsional.
class LoadingWidget extends StatelessWidget {
  final String? label;
  final double size;

  const LoadingWidget({super.key, this.label, this.size = 40});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: size,
              height: size,
              child: const CircularProgressIndicator(
                strokeWidth: 3,
                color: AppTheme.leaf600,
              ),
            ),
            if (label != null) ...[
              const SizedBox(height: 16),
              Text(
                label!,
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  color: AppTheme.leaf900.withValues(alpha: 0.5),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
