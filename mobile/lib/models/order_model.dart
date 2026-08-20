import 'product_model.dart';

class OrderModel {
  final int id;
  final String orderNumber;
  final String status;
  final double subtotal;
  final double shippingCost;
  final double discount;
  final double total;
  final String paymentStatus;
  final String? note;
  final DateTime? createdAt;
  final PaymentModel? payment;
  final ShipmentModel? shipment;
  final List<OrderItemModel> items;

  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.status,
    this.subtotal = 0,
    this.shippingCost = 0,
    this.discount = 0,
    this.total = 0,
    this.paymentStatus = 'pending',
    this.note,
    this.createdAt,
    this.payment,
    this.shipment,
    this.items = const [],
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] ?? 0,
      orderNumber: json['order_number'] ?? '',
      status: json['status'] ?? 'pending',
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      shippingCost: (json['shipping_cost'] ?? 0).toDouble(),
      discount: (json['discount'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
      paymentStatus: json['payment_status'] ?? 'pending',
      note: json['note'],
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      payment: json['payment'] != null ? PaymentModel.fromJson(json['payment']) : null,
      shipment: json['shipment'] != null ? ShipmentModel.fromJson(json['shipment']) : null,
      items: (json['items'] as List<dynamic>?)
          ?.map((e) => OrderItemModel.fromJson(e))
          .toList() ?? [],
    );
  }
}

class OrderItemModel {
  final int id;
  final int productId;
  final int? variantId;
  final int quantity;
  final double unitPrice;
  final double subtotal;
  final ProductModel? product;

  OrderItemModel({
    required this.id,
    required this.productId,
    this.variantId,
    this.quantity = 1,
    this.unitPrice = 0,
    this.subtotal = 0,
    this.product,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      id: json['id'] ?? 0,
      productId: json['product_id'] ?? 0,
      variantId: json['variant_id'],
      quantity: json['quantity'] ?? 1,
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      product: json['product'] != null ? ProductModel.fromJson(json['product']) : null,
    );
  }
}

class PaymentModel {
  final String? method;
  final String? reference;
  final double? amount;
  final String status;

  PaymentModel({this.method, this.reference, this.amount, this.status = 'pending'});

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      method: json['method'],
      reference: json['reference'],
      amount: json['amount']?.toDouble(),
      status: json['status'] ?? 'pending',
    );
  }
}

class ShipmentModel {
  final String? courier;
  final String? trackingNumber;
  final String status;

  ShipmentModel({this.courier, this.trackingNumber, this.status = 'pending'});

  factory ShipmentModel.fromJson(Map<String, dynamic> json) {
    return ShipmentModel(
      courier: json['courier'],
      trackingNumber: json['tracking_number'],
      status: json['status'] ?? 'pending',
    );
  }
}
