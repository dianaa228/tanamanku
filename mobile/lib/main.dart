import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/auth_provider.dart';
import 'features/marketplace/marketplace_provider.dart';
import 'features/cart/cart_provider.dart';
import 'features/orders/order_provider.dart';
import 'features/my_garden/garden_provider.dart';
import 'features/community/community_provider.dart';
import 'features/exchange/exchange_provider.dart';
import 'features/loyalty/loyalty_provider.dart';
import 'features/nursery/nursery_provider.dart';
import 'features/services/gardening_service_provider.dart';
import 'features/seller/seller_provider.dart';
import 'features/admin/admin_provider.dart';
import 'features/subscription/subscription_provider.dart';
import 'features/notification/notification_provider.dart';
import 'routes/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TanamankuApp());
}

class TanamankuApp extends StatelessWidget {
  const TanamankuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..restoreSession()),
        ChangeNotifierProvider(create: (_) => MarketplaceProvider()..loadInitial()),
        ChangeNotifierProvider(create: (_) => CartProvider()..fetchCart()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
        ChangeNotifierProvider(create: (_) => GardenProvider()),
        ChangeNotifierProvider(create: (_) => CommunityProvider()),
        ChangeNotifierProvider(create: (_) => ExchangeProvider()),
        ChangeNotifierProvider(create: (_) => LoyaltyProvider()),
        ChangeNotifierProvider(create: (_) => NurseryProvider()),
        ChangeNotifierProvider(create: (_) => GardeningServiceProvider()),
        ChangeNotifierProvider(create: (_) => SellerProvider()),
        ChangeNotifierProvider(create: (_) => AdminProvider()),
        ChangeNotifierProvider(create: (_) => SubscriptionProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          final router = AppRouter.createRouter(auth);

          return MaterialApp.router(
            title: 'Tanamanku',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.light,
            routerConfig: router,
          );
        },
      ),
    );
  }
}
