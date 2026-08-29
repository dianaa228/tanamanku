import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../models/order_model.dart';
import 'order_provider.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/app_button.dart';

class OrderDetailPage extends StatefulWidget {
  final String id;
  const OrderDetailPage({super.key, required this.id});

  @override
  State<OrderDetailPage> createState() => _OrderDetailPageState();
}

class _OrderDetailPageState extends State<OrderDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrderProvider>().loadOrder(widget.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final orderProv = context.watch<OrderProvider>();

    if (orderProv.loading) return const Scaffold(body: LoadingWidget());
    final order = orderProv.currentOrder;
    if (order == null) return const Scaffold(body: Center(child: Text('Pesanan tidak ditemukan')));

    final meta = _statusMeta(order.status);
    final flow = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'completed'];
    final stepIndex = flow.indexOf(order.status);

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(
        title: Text(order.orderNumber),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: meta['color'].withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
            child: Text('${meta['icon']} ${meta['label']}', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600, color: meta['color'])),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (order.status != 'cancelled') ...[
              _timeline(flow, stepIndex),
              const SizedBox(height: 24),
            ],
            _card(
              title: 'Item Pesanan',
              child: Column(
                children: order.items.map((item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Container(width: 48, height: 48, decoration: BoxDecoration(color: AppTheme.leaf100, borderRadius: BorderRadius.circular(12)), child: Center(child: Text(_itemEmoji(item), style: const TextStyle(fontSize: 24)))),
                      const SizedBox(width: 12),
                      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(item.product?.name ?? 'Produk #${item.productId}', maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
                        Text('${item.quantity}× ${AppFormatter.rupiah(item.unitPrice)}', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5))),
                      ])),
                      Text(AppFormatter.rupiah(item.subtotal), style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                    ],
                  ),
                )).toList(),
              ),
            ),
            const SizedBox(height: 16),
            _card(title: 'Pengiriman', child: Column(children: [
              _infoRow('Kurir', '🚚 ${order.shipment?.courier ?? '—'}'),
              _infoRow('Resi', order.shipment?.trackingNumber ?? 'Belum tersedia'),
              _infoRow('Status', order.shipment?.status ?? '—'),
            ])),
            const SizedBox(height: 16),
            _card(title: 'Rincian Biaya', child: Column(children: [
              _infoRow('Subtotal', AppFormatter.rupiah(order.subtotal)),
              _infoRow('Ongkir', AppFormatter.rupiah(order.shippingCost)),
              if (order.discount > 0) _infoRow('Diskon', '-${AppFormatter.rupiah(order.discount)}'),
              const Divider(height: 20),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text('Total', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
                Text(AppFormatter.rupiah(order.total), style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.leaf700)),
              ]),
            ])),
            const SizedBox(height: 16),
            _card(title: 'Pembayaran', child: Column(children: [
              _infoRow('Metode', order.payment?.method ?? '—'),
              _infoRow('Referensi', order.payment?.reference ?? 'Belum ada'),
              _infoRow('Status', order.paymentStatus),
            ])),
            if (order.status == 'pending') ...[
              const SizedBox(height: 20),
              AppButton.danger(
                label: 'Batalkan pesanan',
                expanded: true,
                onPressed: () async {
                  final success = await orderProv.cancelOrder(order.orderNumber);
                  if (success && context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pesanan dibatalkan')));
                    context.pop();
                  }
                },
              ),
            ],
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _timeline(List<String> flow, int currentStep) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
      child: Row(
        children: flow.asMap().entries.map((entry) {
          final i = entry.key;
          final s = entry.value;
          final done = i <= currentStep;
          final current = i == currentStep;
          final m = _statusMeta(s);
          return Expanded(child: Column(children: [
            Container(width: 28, height: 28, decoration: BoxDecoration(color: current ? AppTheme.leaf600 : done ? AppTheme.leaf100 : AppTheme.leaf50, shape: BoxShape.circle),
              child: Center(child: done && !current ? const Icon(Icons.check, size: 14, color: AppTheme.leaf700) : Text(m['icon'] as String, style: const TextStyle(fontSize: 12)))),
            const SizedBox(height: 4),
            Text(m['label'] as String, style: GoogleFonts.poppins(fontSize: 8, fontWeight: current ? FontWeight.w700 : FontWeight.w500, color: current ? AppTheme.leaf700 : AppTheme.leaf900.withValues(alpha: 0.4)), textAlign: TextAlign.center),
          ]));
        }).toList(),
      ),
    );
  }

  Widget _card({required String title, required Widget child}) {
    return Container(width: double.infinity, padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700)), const SizedBox(height: 12), child]));
  }

  Widget _infoRow(String label, String value) {
    return Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
      Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
    ]));
  }

  String _itemEmoji(OrderItemModel item) {
    final name = (item.product?.name ?? '').toLowerCase();
    if (name.contains('monstera')) return '🌿';
    if (name.contains('sirih')) return '🍃';
    if (name.contains('pot')) return '🏺';
    if (name.contains('pupuk')) return '🧪';
    if (name.contains('sprayer')) return '🚿';
    if (name.contains('cabai')) return '🌶️';
    if (name.contains('tomat')) return '🍅';
    return '🌿';
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
