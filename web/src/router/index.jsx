import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import NotFound from '../pages/NotFound'

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

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'

export const router = createBrowserRouter([
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
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
