import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/app_formatter.dart';
import '../../features/auth/auth_provider.dart';
import '../cart/cart_provider.dart';
import '../orders/order_provider.dart';
import '../../widgets/app_button.dart';
import '../../widgets/loading_widget.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  String _payment = 'transfer';
  String _courier = 'reguler';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CartProvider>().fetchCart();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final cart = context.watch<CartProvider>();
    final orderProv = context.watch<OrderProvider>();

    if (cart.loading) return const Scaffold(body: LoadingWidget());
    if (cart.isEmpty) {
      return Scaffold(body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        const Text('📦', style: TextStyle(fontSize: 64)), const SizedBox(height: 16),
        Text('Tidak ada yang di-checkout', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        AppButton(label: 'Belanja dulu', onPressed: () => context.push('/explore')),
      ])));
    }

    const shippingCost = 15000.0;
    final total = cart.subtotal + shippingCost;

    return Scaffold(
      backgroundColor: AppTheme.cream,
      appBar: AppBar(title: const Text('Checkout 🧾')),
      body: SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        _sectionHeader('1', 'Alamat Pengiriman'),
        const SizedBox(height: 12),
        if (user?.address != null)
          Container(width: double.infinity, padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: AppTheme.leaf50, borderRadius: BorderRadius.circular(14)),
            child: Text('${user!.address!.label} · ${user.address!.recipient}\n${user.address!.street}, ${user.address!.city}', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900)))
        else
          Text('Belum ada alamat. Tambahkan di profil.', style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.5))),
        const SizedBox(height: 24),
        _sectionHeader('2', 'Metode Pengiriman'),
        const SizedBox(height: 12),
        _shippingOption('reguler', 'Reguler', '2–4 hari', shippingCost),
        _shippingOption('express', 'Express', '1–2 hari', 25000),
        const SizedBox(height: 24),
        _sectionHeader('3', 'Metode Pembayaran'),
        const SizedBox(height: 12),
        Wrap(spacing: 8, runSpacing: 8, children: [
          _paymentChip('transfer', '🏦', 'Transfer Bank'),
          _paymentChip('ewallet', '💰', 'E-Wallet'),
          _paymentChip('qris', '📱', 'QRIS'),
          _paymentChip('cod', '💵', 'COD'),
        ]),
        const SizedBox(height: 32),
        Container(width: double.infinity, padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.leaf100)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            ...cart.cart!.items.map((item) => Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [
              Expanded(child: Text('${item.productName} ×${item.quantity}', style: GoogleFonts.poppins(fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis)),
              Text(AppFormatter.rupiah(item.total), style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600)),
            ]))),
            const Divider(),
            _summaryRow('Subtotal', AppFormatter.rupiah(cart.subtotal)),
            _summaryRow('Ongkir', AppFormatter.rupiah(shippingCost)),
            const Divider(),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('Total', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700)),
              Text(AppFormatter.rupiah(total), style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.leaf700)),
            ]),
          ])),
        const SizedBox(height: 20),
        AppButton(label: 'Buat pesanan', expanded: true, loading: orderProv.loading, onPressed: () async {
          if (user?.address == null) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Silakan lengkapi alamat di profil')));
            return;
          }
          final order = await orderProv.createOrder(paymentMethod: _payment, address: user!.address!.toJson(), courier: _courier);
          if (order != null && mounted) {
            await cart.clearCart();
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pesanan berhasil dibuat! 🎉')));
            context.go('/orders');
          }
        }),
        const SizedBox(height: 12),
        Center(child: Text('🔒 Transaksi diproses aman dengan enkripsi.', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.4)))),
      ])),
    );
  }

  Widget _sectionHeader(String num, String title) {
    return Row(children: [
      Container(width: 28, height: 28, decoration: BoxDecoration(color: AppTheme.leaf600, borderRadius: BorderRadius.circular(8)),
        child: Center(child: Text(num, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)))),
      const SizedBox(width: 10),
      Text(title, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700)),
    ]);
  }

  Widget _shippingOption(String value, String label, String eta, double price) {
    final selected = _courier == value;
    return GestureDetector(onTap: () => setState(() => _courier = value),
      child: Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: selected ? AppTheme.leaf50 : Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: selected ? AppTheme.leaf600 : AppTheme.leaf100, width: selected ? 2 : 1)),
        child: Row(children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600)), Text('Estimasi $eta', style: GoogleFonts.poppins(fontSize: 11, color: AppTheme.leaf900.withValues(alpha: 0.5)))])),
          Text(AppFormatter.rupiah(price), style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.leaf700)),
        ])));
  }

  Widget _paymentChip(String value, String icon, String label) {
    final selected = _payment == value;
    return GestureDetector(onTap: () => setState(() => _payment = value),
      child: Container(padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10), decoration: BoxDecoration(color: selected ? AppTheme.leaf50 : Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: selected ? AppTheme.leaf600 : AppTheme.leaf200, width: selected ? 2 : 1)),
        child: Text('$icon $label', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600))));
  }

  Widget _summaryRow(String label, String value) {
    return Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: GoogleFonts.poppins(fontSize: 13, color: AppTheme.leaf900.withValues(alpha: 0.6))),
      Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600)),
    ]));
  }
}
