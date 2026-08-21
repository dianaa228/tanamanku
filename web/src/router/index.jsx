import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import NotFound from '../pages/NotFound'

// Customer pages
import Home from '../pages/customer/Home'
import Explore from '../pages/customer/Explore'
import ProductDetail from '../pages/customer/ProductDetail'
import Cart from '../pages/customer/Cart'
import Checkout from '../pages/customer/Checkout'
import Orders from '../pages/customer/Orders'
import OrderDetail from '../pages/customer/OrderDetail'
import MyGarden from '../pages/customer/MyGarden'
import PlantDetail from '../pages/customer/PlantDetail'
import PlantFinder from '../pages/customer/PlantFinder'
import PlantDiagnosis from '../pages/customer/PlantDiagnosis'
import Community from '../pages/customer/Community'
import Profile from '../pages/customer/Profile'
import Services from '../pages/customer/Services'
import ServiceDetail from '../pages/customer/ServiceDetail'
import MyBookings from '../pages/customer/MyBookings'
import PlantExchange from '../pages/customer/PlantExchange'
import ListingDetail from '../pages/customer/ListingDetail'
import CreateListing from '../pages/customer/CreateListing'
import MyListings from '../pages/customer/MyListings'
import MyExchanges from '../pages/customer/MyExchanges'
import Loyalty from '../pages/customer/Loyalty'
import LoyaltyRedeem from '../pages/customer/LoyaltyRedeem'
import LoyaltyHistory from '../pages/customer/LoyaltyHistory'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'

// Seller pages
import SellerDashboard from '../pages/seller/Dashboard'
import SellerProducts from '../pages/seller/Products'
import SellerCreateProduct from '../pages/seller/CreateProduct'
import SellerEditProduct from '../pages/seller/EditProduct'
import SellerOrders from '../pages/seller/Orders'
import SellerInventory from '../pages/seller/Inventory'
import SellerSales from '../pages/seller/Sales'
import SellerAnalytics from '../pages/seller/Analytics'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminStores from '../pages/admin/Stores'
import AdminCategories from '../pages/admin/Categories'
import AdminOrders from '../pages/admin/Orders'
import AdminPayments from '../pages/admin/Payments'
import AdminCommunity from '../pages/admin/Community'
import AdminReports from '../pages/admin/Reports'
import AdminSettings from '../pages/admin/Settings'

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
      { path: '/', element: <Home /> },
      { path: '/explore', element: <Explore /> },
      { path: '/product/:slug', element: <ProductDetail /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/orders', element: <Orders /> },
      { path: '/orders/:id', element: <OrderDetail /> },
      { path: '/my-garden', element: <MyGarden /> },
      { path: '/my-garden/:id', element: <PlantDetail /> },
      { path: '/plant-finder', element: <PlantFinder /> },
      { path: '/plant-diagnosis', element: <PlantDiagnosis /> },
      { path: '/community', element: <Community /> },
      { path: '/profile', element: <Profile /> },
      { path: '/services', element: <Services /> },
      { path: '/services/:id', element: <ServiceDetail /> },
      { path: '/my-bookings', element: <MyBookings /> },
      { path: '/plant-exchange', element: <PlantExchange /> },
      { path: '/plant-exchange/create', element: <CreateListing /> },
      { path: '/plant-exchange/:id', element: <ListingDetail /> },
      { path: '/my-listings', element: <MyListings /> },
      { path: '/my-exchanges', element: <MyExchanges /> },
      { path: '/loyalty', element: <Loyalty /> },
      { path: '/loyalty/redeem', element: <LoyaltyRedeem /> },
      { path: '/loyalty/history', element: <LoyaltyHistory /> },
    ],
  },

  // ── Auth ──
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },

  // ── Seller ──
  {
    element: <DashboardLayout role="seller" navItems={sellerNav} />,
    children: [
      { path: '/seller', element: <SellerDashboard /> },
      { path: '/seller/products', element: <SellerProducts /> },
      { path: '/seller/products/create', element: <SellerCreateProduct /> },
      { path: '/seller/products/:id/edit', element: <SellerEditProduct /> },
      { path: '/seller/orders', element: <SellerOrders /> },
      { path: '/seller/inventory', element: <SellerInventory /> },
      { path: '/seller/sales', element: <SellerSales /> },
      { path: '/seller/analytics', element: <SellerAnalytics /> },
    ],
  },

  // ── Admin ──
  {
    element: <DashboardLayout role="admin" navItems={adminNav} />,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/users', element: <AdminUsers /> },
      { path: '/admin/stores', element: <AdminStores /> },
      { path: '/admin/categories', element: <AdminCategories /> },
      { path: '/admin/orders', element: <AdminOrders /> },
      { path: '/admin/payments', element: <AdminPayments /> },
      { path: '/admin/community', element: <AdminCommunity /> },
      { path: '/admin/reports', element: <AdminReports /> },
      { path: '/admin/settings', element: <AdminSettings /> },
    ],
  },

  // ── 404 ──
  { path: '*', element: <NotFound /> },
])
