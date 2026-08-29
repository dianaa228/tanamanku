import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../services/admin_service.dart';
import 'admin_provider.dart';
import '../../widgets/loading_widget.dart';

class AdminUsersPage extends StatefulWidget {
  const AdminUsersPage({super.key});
  @override
  State<AdminUsersPage> createState() => _AdminUsersPageState();
}

class _AdminUsersPageState extends State<AdminUsersPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<AdminProvider>().loadUsers());
  }

  @override
  Widget build(BuildContext context) {
    final ap = context.watch<AdminProvider>();
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(statusBarColor: Colors.transparent, statusBarIconBrightness: Brightness.dark),
      child: Scaffold(
        backgroundColor: AppTheme.cream,
        appBar: AppBar(title: Text('👥 Pengguna', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700))),
        body: ap.loading
            ? const LoadingWidget()
            : RefreshIndicator(
                onRefresh: () => ap.loadUsers(),
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: ap.users.length,
                  itemBuilder: (context, i) {
                    final u = ap.users[i];
                    final isActive = u['is_active'] == true;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white, borderRadius: BorderRadius.circular(16),
                        boxShadow: [BoxShadow(color: AppTheme.leaf900.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2))],
                      ),
                      child: Row(children: [
                        Container(
                          width: 44, height: 44,
                          decoration: BoxDecoration(
                            color: isActive ? AppTheme.leaf100 : const Color(0xFFFEE2E2),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Center(
                            child: Text((u['name'] ?? '?')[0].toUpperCase(),
                                style: TextStyle(color: isActive ? AppTheme.leaf700 : const Color(0xFFDC2626), fontWeight: FontWeight.w700)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(u['name'] ?? '', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 13, color: AppTheme.leaf950)),
                          Text(u['email'] ?? '', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.leaf400)),
                          Text(u['role'] ?? '', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.leaf600)),
                        ])),
                        IconButton(
                          icon: Icon(isActive ? Icons.toggle_on : Icons.toggle_off, color: isActive ? AppTheme.leaf600 : Colors.grey, size: 28),
                          onPressed: () async { await AdminService().toggleUserActive(u['id']); ap.loadUsers(); },
                        ),
                      ]),
                    );
                  },
                ),
              ),
      ),
    );
  }
}
