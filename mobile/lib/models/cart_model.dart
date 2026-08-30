
class CartModel {
  final int id;
  final List<CartItemModel> items;
  final int _apiCount;
  final double _apiSubtotal;

  CartModel({this.id = 0, this.items = const [], int apiCount = 0, double apiSubtotal = 0})
      : _apiCount = apiCount,
        _apiSubtotal = apiSubtotal;

  factory CartModel.fromJson(Map<String, dynamic> json) {
    return CartModel(
      id: json['id'] ?? 0,
      items: (json['items'] as List<dynamic>?)
          ?.map((e) => CartItemModel.fromJson(e))
          .toList() ?? [],
      apiCount: json['count'] ?? 0,
      apiSubtotal: (json['subtotal'] ?? 0).toDouble(),
    );
  }

  int get itemCount => _apiCount > 0 ? _apiCount : items.fold(0, (sum, item) => sum + item.quantity);
  double get subtotal => _apiSubtotal > 0 ? _apiSubtotal : items.fold(0, (sum, item) => sum + item.quantity * item.unitPrice);
}

class CartItemModel {
  final int id;
  final int productId;
  final String productName;
  final String? variantName;
  final int quantity;
  final double unitPrice;
  final int? productStock;

  CartItemModel({
    required this.id,
    required this.productId,
    this.productName = '',
    this.variantName,
    this.quantity = 1,
    this.unitPrice = 0,
    this.productStock,
  });

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      id: json['id'] ?? 0,
      productId: json['product_id'] ?? 0,
      productName: json['product']?['name'] ?? '',
      variantName: json['variant']?['name'],
      quantity: json['quantity'] ?? 1,
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      productStock: json['product']?['stock'],
    );
  }

  double get total => quantity * unitPrice;
}
