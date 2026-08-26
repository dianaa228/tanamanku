import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import NotFound from '../pages/NotFound'
import Loading from '../components/ui/Loading'

// ── Lazy-loaded Customer pages ──
const Home = lazy(() => import('../pages/customer/Home'))
const Explore = lazy(() => import('../pages/customer/Explore'))
const ProductDetail = lazy(() => import('../pages/customer/ProductDetail'))
const Cart = lazy(() => import('../pages/customer/Cart'))
const Checkout = lazy(() => import('../pages/customer/Checkout'))
const Orders = lazy(() => import('../pages/customer/Orders'))
const OrderDetail = lazy(() => import('../pages/customer/OrderDetail'))
const MyGarden = lazy(() => import('../pages/customer/MyGarden'))
const PlantDetail = lazy(() => import('../pages/customer/PlantDetail'))
const PlantFinder = lazy(() => import('../pages/customer/PlantFinder'))
const PlantDiagnosis = lazy(() => import('../pages/customer/PlantDiagnosis'))
const Community = lazy(() => import('../pages/customer/Community'))
const Profile = lazy(() => import('../pages/customer/Profile'))
const Services = lazy(() => import('../pages/customer/Services'))
const ServiceDetail = lazy(() => import('../pages/customer/ServiceDetail'))
const MyBookings = lazy(() => import('../pages/customer/MyBookings'))
const PlantExchange = lazy(() => import('../pages/customer/PlantExchange'))
const ListingDetail = lazy(() => import('../pages/customer/ListingDetail'))
const CreateListing = lazy(() => import('../pages/customer/CreateListing'))
const MyListings = lazy(() => import('../pages/customer/MyListings'))
const MyExchanges = lazy(() => import('../pages/customer/MyExchanges'))
const Loyalty = lazy(() => import('../pages/customer/Loyalty'))
const LoyaltyRedeem = lazy(() => import('../pages/customer/LoyaltyRedeem'))
const LoyaltyHistory = lazy(() => import('../pages/customer/LoyaltyHistory'))
const Subscription = lazy(() => import('../pages/customer/Subscription'))
const SubscriptionManage = lazy(() => import('../pages/customer/SubscriptionManage'))
const Nurseries = lazy(() => import('../pages/customer/Nurseries'))
const NurseryDetail = lazy(() => import('../pages/customer/NurseryDetail'))

// ── Lazy-loaded Auth pages ──
const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'))

// ── Lazy-loaded Seller pages ──
const SellerDashboard = lazy(() => import('../pages/seller/Dashboard'))
const SellerProducts = lazy(() => import('../pages/seller/Products'))
const SellerCreateProduct = lazy(() => import('../pages/seller/CreateProduct'))
const SellerEditProduct = lazy(() => import('../pages/seller/EditProduct'))
const SellerOrders = lazy(() => import('../pages/seller/Orders'))
const SellerInventory = lazy(() => import('../pages/seller/Inventory'))
const SellerSales = lazy(() => import('../pages/seller/Sales'))
const SellerAnalytics = lazy(() => import('../pages/seller/Analytics'))

// ── Lazy-loaded Admin pages ──
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('../pages/admin/Users'))
const AdminStores = lazy(() => import('../pages/admin/Stores'))
const AdminCategories = lazy(() => import('../pages/admin/Categories'))
const AdminOrders = lazy(() => import('../pages/admin/Orders'))
const AdminPayments = lazy(() => import('../pages/admin/Payments'))
const AdminCommunity = lazy(() => import('../pages/admin/Community'))
const AdminReports = lazy(() => import('../pages/admin/Reports'))
const AdminSettings = lazy(() => import('../pages/admin/Settings'))
const AdminAnalytics = lazy(() => import('../pages/admin/Analytics'))

// ── Suspense wrapper ──
function LazyPage({ children }) {
  return (
    <Suspense fallback={<Loading label="Memuat halaman..." />}>
      {children}
    </Suspense>
  )
}

// ── Nav config ──

const sellerNav = [
  { to: '/seller', icon: '📊', label: 'Dashboard' },
  { to: '/seller/products', icon: '📦', label: 'Produk' },
  { to: '/seller/orders', icon: '🧾', label: 'Pesanan' },
  { to: '/seller/inventory', icon: '📋', label: 'Inventaris' },
  { to: '/seller/sales', icon: '💰', label: 'Penjualan' },
  { to: '/seller/analytics', icon: '📈', label: 'Analytics' },
]

const adminNav = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { to: '/admin/users', icon: '👥', label: 'Pengguna' },
  { to: '/admin/stores', icon: '🏪', label: 'Toko' },
  { to: '/admin/categories', icon: '🏷️', label: 'Kategori' },
  { to: '/admin/orders', icon: '🧾', label: 'Pesanan' },
  { to: '/admin/payments', icon: '💳', label: 'Pembayaran' },
  { to: '/admin/community', icon: '💬', label: 'Komunitas' },
  { to: '/admin/reports', icon: '📈', label: 'Laporan' },
  { to: '/admin/settings', icon: '⚙️', label: 'Pengaturan' },
]

export const router = createBrowserRouter([
  // ── Customer (public) ──
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LazyPage><Home /></LazyPage> },
      { path: '/explore', element: <LazyPage><Explore /></LazyPage> },
      { path: '/product/:slug', element: <LazyPage><ProductDetail /></LazyPage> },
      { path: '/cart', element: <LazyPage><Cart /></LazyPage> },
      { path: '/checkout', element: <LazyPage><Checkout /></LazyPage> },
      { path: '/orders', element: <LazyPage><Orders /></LazyPage> },
      { path: '/orders/:id', element: <LazyPage><OrderDetail /></LazyPage> },
      { path: '/my-garden', element: <LazyPage><MyGarden /></LazyPage> },
      { path: '/my-garden/:id', element: <LazyPage><PlantDetail /></LazyPage> },
      { path: '/plant-finder', element: <LazyPage><PlantFinder /></LazyPage> },
      { path: '/plant-diagnosis', element: <LazyPage><PlantDiagnosis /></LazyPage> },
      { path: '/community', element: <LazyPage><Community /></LazyPage> },
      { path: '/profile', element: <LazyPage><Profile /></LazyPage> },
      { path: '/services', element: <LazyPage><Services /></LazyPage> },
      { path: '/services/:id', element: <LazyPage><ServiceDetail /></LazyPage> },
      { path: '/my-bookings', element: <LazyPage><MyBookings /></LazyPage> },
      { path: '/plant-exchange', element: <LazyPage><PlantExchange /></LazyPage> },
      { path: '/plant-exchange/create', element: <LazyPage><CreateListing /></LazyPage> },
      { path: '/plant-exchange/:id', element: <LazyPage><ListingDetail /></LazyPage> },
      { path: '/my-listings', element: <LazyPage><MyListings /></LazyPage> },
      { path: '/my-exchanges', element: <LazyPage><MyExchanges /></LazyPage> },
      { path: '/loyalty', element: <LazyPage><Loyalty /></LazyPage> },
      { path: '/loyalty/redeem', element: <LazyPage><LoyaltyRedeem /></LazyPage> },
      { path: '/loyalty/history', element: <LazyPage><LoyaltyHistory /></LazyPage> },
      { path: '/subscription', element: <LazyPage><Subscription /></LazyPage> },
      { path: '/subscription/manage', element: <LazyPage><SubscriptionManage /></LazyPage> },
      { path: '/nurseries', element: <LazyPage><Nurseries /></LazyPage> },
      { path: '/nurseries/:slug', element: <LazyPage><NurseryDetail /></LazyPage> },
    ],
  },

  // ── Auth ──
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LazyPage><Login /></LazyPage> },
      { path: '/register', element: <LazyPage><Register /></LazyPage> },
      { path: '/forgot-password', element: <LazyPage><ForgotPassword /></LazyPage> },
    ],
  },

  // ── Seller ──
  {
    element: <DashboardLayout role="seller" navItems={sellerNav} />,
    children: [
      { path: '/seller', element: <LazyPage><SellerDashboard /></LazyPage> },
      { path: '/seller/products', element: <LazyPage><SellerProducts /></LazyPage> },
      { path: '/seller/products/create', element: <LazyPage><SellerCreateProduct /></LazyPage> },
      { path: '/seller/products/:id/edit', element: <LazyPage><SellerEditProduct /></LazyPage> },
      { path: '/seller/orders', element: <LazyPage><SellerOrders /></LazyPage> },
      { path: '/seller/inventory', element: <LazyPage><SellerInventory /></LazyPage> },
      { path: '/seller/sales', element: <LazyPage><SellerSales /></LazyPage> },
      { path: '/seller/analytics', element: <LazyPage><SellerAnalytics /></LazyPage> },
    ],
  },

  // ── Admin ──
  {
    element: <DashboardLayout role="admin" navItems={adminNav} />,
    children: [
      { path: '/admin', element: <LazyPage><AdminDashboard /></LazyPage> },
      { path: '/admin/users', element: <LazyPage><AdminUsers /></LazyPage> },
      { path: '/admin/stores', element: <LazyPage><AdminStores /></LazyPage> },
      { path: '/admin/categories', element: <LazyPage><AdminCategories /></LazyPage> },
      { path: '/admin/orders', element: <LazyPage><AdminOrders /></LazyPage> },
      { path: '/admin/payments', element: <LazyPage><AdminPayments /></LazyPage> },
      { path: '/admin/community', element: <LazyPage><AdminCommunity /></LazyPage> },
      { path: '/admin/reports', element: <LazyPage><AdminReports /></LazyPage> },
      { path: '/admin/settings', element: <LazyPage><AdminSettings /></LazyPage> },
      { path: '/admin/analytics', element: <LazyPage><AdminAnalytics /></LazyPage> },
    ],
  },

  // ── 404 ──
  { path: '*', element: <NotFound /> },
])
