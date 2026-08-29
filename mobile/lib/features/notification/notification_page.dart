import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import 'notification_provider.dart';
import '../../widgets/loading_widget.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({super.key});
  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => context.read<NotificationProvider>().loadNotifications());
  }

  @override
  Widget build(BuildContext context) {
    final np = context.watch<NotificationProvider>();
    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: const Text('🔔 Notifikasi'),
        actions: [
          if (np.notifications.isNotEmpty)
            TextButton(
              onPressed: () => np.markAllAsRead(),
              child: Text('Baca semua', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf600)),
            ),
        ],
      ),
      body: np.loading
          ? const LoadingWidget()
          : np.notifications.isEmpty
              ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Text('🔔', style: TextStyle(fontSize: 56)),
                  const SizedBox(height: 12),
                  Text('Tidak ada notifikasi', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
                ]))
              : RefreshIndicator(
                  onRefresh: () => np.loadNotifications(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: np.notifications.length,
                    itemBuilder: (context, i) {
                      final n = np.notifications[i];
                      final isRead = n['read_at'] != null;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: isRead ? Colors.white : AppTheme.leaf50,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: isRead ? AppTheme.leaf100 : AppTheme.leaf200),
                        ),
                        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Container(
                            width: 40, height: 40,
                            decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(12)),
                            child: const Center(child: Text('🔔', style: TextStyle(fontSize: 18))),
                          ),
                          const SizedBox(width: 12),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(n['title'] ?? n['data']?['title'] ?? 'Notifikasi', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                            const SizedBox(height: 4),
                            Text(n['body'] ?? n['data']?['body'] ?? '', style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6)), maxLines: 2, overflow: TextOverflow.ellipsis),
                          ])),
                          if (!isRead)
                            Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppTheme.leaf600, shape: BoxShape.circle)),
                        ]),
                      );
                    },
                  ),
                ),
    );
  }
}
