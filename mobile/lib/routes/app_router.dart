import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/auth_provider.dart';
import '../features/auth/login_page.dart';
import '../features/auth/register_page.dart';
import '../features/auth/forgot_password_page.dart';
import '../features/auth/reset_password_page.dart';
import '../features/home/home_page.dart';
import '../features/marketplace/explore_page.dart';
import '../features/marketplace/product_detail_page.dart';
import '../features/cart/cart_page.dart';
import '../features/checkout/checkout_page.dart';
import '../features/orders/orders_page.dart';
import '../features/orders/order_detail_page.dart';
import '../features/my_garden/my_garden_page.dart';
import '../features/my_garden/plant_detail_page.dart';
import '../features/my_garden/plant_finder_page.dart';
import '../features/my_garden/plant_diagnosis_page.dart';
import '../features/community/community_page.dart';
import '../features/profile/profile_page.dart';
import '../features/exchange/plant_exchange_page.dart';
import '../features/exchange/listing_detail_page.dart';
import '../features/services/services_page.dart';
import '../features/loyalty/loyalty_page.dart';
import '../features/loyalty/loyalty_redeem_page.dart';
import '../features/loyalty/loyalty_history_page.dart';
import '../features/nursery/nurseries_page.dart';
import '../features/seller/seller_dashboard_page.dart';
import '../features/seller/seller_products_page.dart';
import '../features/seller/seller_orders_page.dart';
import '../features/seller/seller_inventory_page.dart';
import '../features/seller/seller_sales_page.dart';
import '../features/admin/admin_dashboard_page.dart';
import '../features/admin/admin_users_page.dart';
import '../features/admin/admin_stores_page.dart';
import '../features/admin/admin_categories_page.dart';
import '../features/admin/admin_orders_page.dart';
import '../features/admin/admin_payments_page.dart';
import '../features/admin/admin_community_page.dart';
import '../features/admin/admin_reports_page.dart';
import '../features/admin/admin_settings_page.dart';
import '../features/admin/admin_analytics_page.dart';
import '../features/subscription/subscription_page.dart';
import '../features/services/my_bookings_page.dart';
import '../features/exchange/my_listings_page.dart';
import '../features/exchange/my_exchanges_page.dart';
import '../features/notification/notification_page.dart';

/// Router utama Tanamanku — menggunakan GoRouter.
class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static GoRouter createRouter(AuthProvider auth) {
    return GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: '/',
      redirect: (context, state) {
        final loggedIn = auth.isAuthenticated;
        final isAuthRoute = state.matchedLocation == '/login' ||
            state.matchedLocation == '/register' ||
            state.matchedLocation == '/forgot-password' ||
            state.matchedLocation.startsWith('/reset-password');

        // Jika belum login dan bukan halaman auth, arahkan ke login
        // (Halaman publik seperti /, /explore, /product tetap bisa diakses)

        // Jika sudah login dan di halaman auth, arahkan ke home
        if (loggedIn && isAuthRoute) return '/';

        return null;
      },
      routes: [
        // ── Main shell (bottom nav) ──
        ShellRoute(
          navigatorKey: _shellNavigatorKey,
          builder: (context, state, child) => MainScaffold(child: child),
          routes: [
            GoRoute(path: '/', builder: (_, __) => const HomePage()),
            GoRoute(path: '/explore', builder: (_, __) => const ExplorePage()),
            GoRoute(path: '/cart', builder: (_, __) => const CartPage()),
            GoRoute(path: '/orders', builder: (_, __) => const OrdersPage()),
            GoRoute(path: '/my-garden', builder: (_, __) => const MyGardenPage()),
          ],
        ),

        // ── Detail pages (tanpa bottom nav) ──
        GoRoute(
          path: '/login',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const LoginPage(),
        ),
        GoRoute(
          path: '/register',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const RegisterPage(),
        ),
        GoRoute(
          path: '/forgot-password',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const ForgotPasswordPage(),
        ),
        GoRoute(
          path: '/reset-password',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, state) {
            final token = state.uri.queryParameters['token'];
            final email = state.uri.queryParameters['email'];
            return ResetPasswordPage(token: token, email: email);
          },
        ),
        GoRoute(
          path: '/product/:slug',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, state) => ProductDetailPage(slug: state.pathParameters['slug']!),
        ),
        GoRoute(
          path: '/checkout',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const CheckoutPage(),
        ),
        GoRoute(
          path: '/orders/:id',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, state) => OrderDetailPage(id: state.pathParameters['id']!),
        ),
        GoRoute(
          path: '/my-garden/:id',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, state) => PlantDetailPage(
            plantId: int.parse(state.pathParameters['id']!),
          ),
        ),
        GoRoute(
          path: '/plant-finder',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const PlantFinderPage(),
        ),
        GoRoute(
          path: '/plant-diagnosis',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const PlantDiagnosisPage(),
        ),
        GoRoute(
          path: '/community',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const CommunityPage(),
        ),
        GoRoute(
          path: '/plant-exchange',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const PlantExchangePage(),
        ),
        GoRoute(
          path: '/plant-exchange/:id',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, state) => ListingDetailPage(listingId: int.parse(state.pathParameters['id']!)),
        ),
        GoRoute(
          path: '/services',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const ServicesPage(),
        ),
        GoRoute(
          path: '/loyalty',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const LoyaltyPage(),
        ),
        GoRoute(
          path: '/loyalty/redeem',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const LoyaltyRedeemPage(),
        ),
        GoRoute(
          path: '/loyalty/history',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const LoyaltyHistoryPage(),
        ),
        GoRoute(
          path: '/nurseries',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const NurseriesPage(),
        ),
        GoRoute(
          path: '/profile',
          parentNavigatorKey: _rootNavigatorKey,
          builder: (_, __) => const ProfilePage(),
        ),
        // ── Notifications ──
        GoRoute(path: '/notifications', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const NotificationPage()),
        // ── Subscription ──
        GoRoute(path: '/subscription', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SubscriptionPage()),
        // ── My Bookings ──
        GoRoute(path: '/my-bookings', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const MyBookingsPage()),
        // ── My Listings / Exchanges ──
        GoRoute(path: '/my-listings', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const MyListingsPage()),
        GoRoute(path: '/my-exchanges', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const MyExchangesPage()),
        // ── Seller ──
        GoRoute(path: '/seller', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SellerDashboardPage()),
        GoRoute(path: '/seller/products', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SellerProductsPage()),
        GoRoute(path: '/seller/orders', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SellerOrdersPage()),
        GoRoute(path: '/seller/inventory', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SellerInventoryPage()),
        GoRoute(path: '/seller/sales', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const SellerSalesPage()),
        // ── Admin ──
        GoRoute(path: '/admin', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminDashboardPage()),
        GoRoute(path: '/admin/users', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminUsersPage()),
        GoRoute(path: '/admin/stores', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminStoresPage()),
        GoRoute(path: '/admin/categories', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminCategoriesPage()),
        GoRoute(path: '/admin/orders', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminOrdersPage()),
        GoRoute(path: '/admin/payments', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminPaymentsPage()),
        GoRoute(path: '/admin/community', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminCommunityPage()),
        GoRoute(path: '/admin/reports', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminReportsPage()),
        GoRoute(path: '/admin/settings', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminSettingsPage()),
        GoRoute(path: '/admin/analytics', parentNavigatorKey: _rootNavigatorKey, builder: (_, __) => const AdminAnalyticsPage()),
      ],
    );
  }
}

/// Scaffold dengan bottom navigation bar.
class MainScaffold extends StatefulWidget {
  final Widget child;
  const MainScaffold({super.key, required this.child});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

  static const _tabs = [
    {'route': '/', 'icon': Icons.home_rounded, 'label': 'Beranda'},
    {'route': '/explore', 'icon': Icons.storefront_outlined, 'label': 'Jelajahi'},
    {'route': '/cart', 'icon': Icons.shopping_cart_outlined, 'label': 'Keranjang'},
    {'route': '/my-garden', 'icon': Icons.yard_outlined, 'label': 'Garden'},
    {'route': '/profile', 'icon': Icons.person_outline_rounded, 'label': 'Profil'},
  ];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final location = GoRouterState.of(context).matchedLocation;
    for (int i = 0; i < _tabs.length; i++) {
      if (location == _tabs[i]['route']) {
        if (_currentIndex != i) setState(() => _currentIndex = i);
        break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) {
          setState(() => _currentIndex = i);
          context.go(_tabs[i]['route'] as String);
        },
        items: _tabs.map((t) => BottomNavigationBarItem(
          icon: Icon(t['icon'] as IconData),
          label: t['label'] as String,
        )).toList(),
      ),
    );
  }
}
