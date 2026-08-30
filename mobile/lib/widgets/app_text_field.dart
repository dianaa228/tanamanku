import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme/app_theme.dart';

/// Input field reusable dengan label, prefix icon, dan error message.
class AppTextField extends StatefulWidget {
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
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  bool _obscureText = false;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.obscure;
  }

  @override
  void didUpdateWidget(covariant AppTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.obscure != oldWidget.obscure) {
      _obscureText = widget.obscure;
    }
  }

  @override
  Widget build(BuildContext context) {
    final showToggle = widget.obscure;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppTheme.leaf900,
            ),
          ),
          const SizedBox(height: 6),
        ],
        TextFormField(
          controller: widget.controller,
          onChanged: widget.onChanged,
          onEditingComplete: widget.onEditingComplete,
          validator: widget.validator,
          obscureText: _obscureText,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          maxLines: widget.obscure ? 1 : widget.maxLines,
          enabled: widget.enabled,
          autofocus: widget.autofocus,
          style: GoogleFonts.poppins(fontSize: 14, color: AppTheme.leaf950),
          decoration: InputDecoration(
            hintText: widget.hint,
            prefixIcon: widget.prefixIcon != null
                ? Icon(widget.prefixIcon, size: 20, color: AppTheme.leaf900.withValues(alpha: 0.4))
                : null,
            suffixIcon: showToggle
                ? IconButton(
                    icon: Icon(
                      _obscureText ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      size: 20,
                      color: AppTheme.leaf900.withValues(alpha: 0.4),
                    ),
                    onPressed: () {
                      setState(() {
                        _obscureText = !_obscureText;
                      });
                    },
                  )
                : widget.suffix,
            errorText: widget.error,
            errorStyle: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFFEF4444)),
          ),
        ),
        if (widget.hintBelow != null && widget.error == null) ...[
          const SizedBox(height: 4),
          Text(
            widget.hintBelow!,
            style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.4)),
          ),
        ],
      ],
    );
  }
}
