import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_theme.dart';

/// Input field reusable dengan label, prefix icon, dan error message.
class AppTextField extends StatelessWidget {
  final String? label;
  final String? hint;
  final String? error;
  final String? hintBelow;
  final IconData? prefixIcon;
  final Widget? suffix;
  final bool obscure;
  final TextInputType keyboardType;
  final TextInputAction textInputAction;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onEditingComplete;
  final FormFieldValidator<String>? validator;
  final int maxLines;
  final bool enabled;
  final bool autofocus;

  const AppTextField({
    super.key,
    this.label,
    this.hint,
    this.error,
    this.hintBelow,
    this.prefixIcon,
    this.suffix,
    this.obscure = false,
    this.keyboardType = TextInputType.text,
    this.textInputAction = TextInputAction.next,
    this.controller,
    this.onChanged,
    this.onEditingComplete,
    this.validator,
    this.maxLines = 1,
    this.enabled = true,
    this.autofocus = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppTheme.leaf900,
            ),
          ),
          const SizedBox(height: 6),
        ],
        TextFormField(
          controller: controller,
          onChanged: onChanged,
          onEditingComplete: onEditingComplete,
          validator: validator,
          obscureText: obscure,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          maxLines: maxLines,
          enabled: enabled,
          autofocus: autofocus,
          style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf950),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: prefixIcon != null
                ? Icon(prefixIcon, size: 20, color: AppTheme.leaf900.withValues(alpha: 0.4))
                : null,
            suffixIcon: suffix,
            errorText: error,
            errorStyle: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFFEF4444)),
          ),
        ),
        if (hintBelow != null && error == null) ...[
          const SizedBox(height: 4),
          Text(
            hintBelow!,
            style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.4)),
          ),
        ],
      ],
    );
  }
}
