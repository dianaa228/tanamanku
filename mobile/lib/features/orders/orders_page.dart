import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../models/order_model.dart';
import '../../services/order_service.dart';
import '../../widgets/loading_widget.dart';

class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key});

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  final _service = OrderService();
  List<OrderModel> _orders = [];
  bool _loading = true;
  String _tab = 'semua';

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    try {
      final orders = await _service.getOrders();
      if (mounted) setState(() { _orders = orders; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tabs = [
      {'value': 'semua', 'label': 'Semua'},
      {'value': 'pending', 'label': 'Menunggu'},
      {'value': 'shipped', 'label': 'Dikirim'},
      {'value': 'completed', 'label': 'Selesai'},
      {'value': 'cancelled', 'label': 'Batal'},
    ];

    final filtered = _tab == 'semua' ? _orders : _orders.where((o) => o.status == _tab).toList();

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('Pesanan Saya 📦')),
      body: Column(
        children: [
          // Tabs
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              itemCount: tabs.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final t = tabs[i];
                final selected = _tab == t['value'];
                return FilterChip(
                  label: Text(t['label']!, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600)),
                  selected: selected,
                  onSelected: (_) => setState(() => _tab = t['value']!),
                  selectedColor: AppTheme.leaf600,
                  labelStyle: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: selected ? Colors.white : AppTheme.leaf900),
                  checkmarkColor: Colors.white,
                  side: BorderSide(color: selected ? AppTheme.leaf600 : AppTheme.leaf200),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                );
              },
            ),
          ),

          // Orders list
          Expanded(
            child: _loading
                ? const LoadingWidget()
                : filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('🧾', style: TextStyle(fontSize: 48)),
                            const SizedBox(height: 12),
                            Text('Belum ada pesanan', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)),
                            const SizedBox(height: 8),
                            ElevatedButton(onPressed: () => context.push('/explore'), child: const Text('Mulai belanja')),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadOrders,
                        child: ListView.separated(
                          padding: const EdgeInsets.all(20),
                          itemCount: filtered.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, i) => _orderCard(filtered[i]),
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _orderCard(OrderModel order) {
    final meta = _statusMeta(order.status);
    return GestureDetector(
      onTap: () => context.push('/orders/${order.orderNumber}'),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.leaf100),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(order.orderNumber, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                    Text(AppFormatter.dateTime(order.createdAt), style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: meta['color'].withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${meta['icon']} ${meta['label']}',
                    style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: meta['color']),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              order.items.map((i) => i.product?.name ?? 'Produk').join(', '),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.poppins(fontSize: 12, color: AppTheme.leaf900.withValues(alpha: 0.6)),
            ),
            const SizedBox(height: 4),
            Text(
              AppFormatter.rupiah(order.total),
              style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.leaf700),
            ),
          ],
        ),
      ),
    );
  }

  Map<String, dynamic> _statusMeta(String status) {
    switch (status) {
      case 'pending': return {'icon': '⏳', 'label': 'Menunggu', 'color': AppTheme.sun500};
      case 'paid': return {'icon': '💳', 'label': 'Dibayar', 'color': AppTheme.leaf600};
      case 'processing': return {'icon': '📦', 'label': 'Diproses', 'color': AppTheme.leaf600};
      case 'shipped': return {'icon': '🚚', 'label': 'Dikirim', 'color': const Color(0xFF0EA5E9)};
      case 'delivered': return {'icon': '📬', 'label': 'Terkirim', 'color': AppTheme.leaf600};
      case 'completed': return {'icon': '✅', 'label': 'Selesai', 'color': AppTheme.leaf600};
      case 'cancelled': return {'icon': '❌', 'label': 'Dibatalkan', 'color': const Color(0xFFEF4444)};
      default: return {'icon': '📋', 'label': status, 'color': AppTheme.leaf900};
    }
  }
}
