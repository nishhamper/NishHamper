// src/routes/AppRoutes.js
import { Routes, Route, Navigate } from 'react-router-dom';

// User Pages
import Home from '../pages/Home';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import ProductDetail from '../pages/ProductDetails';
import About from '../pages/About';
import SignupPage from '../pages/SignupPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import ContactPage from '../pages/Contact';
import ProductCheckout from '../pages/ProductCheckout';
import CategoryPage from '../pages/CategoryPage';

// Admin Pages
import AdminDashboard from '../admin/AdminDashboard';
import AdminLogin from '../admin/AdminLogin';
import ProductManagement from '../admin/ProductManagement';
import OrderManagement from '../admin/OrderManagement';
import UserManagement from '../admin/UserManagement';
import CustomGiftManagement from '../admin/CustomOrderManagement';


// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Protection
import ProtectedAdminRoute from './ProtectedAdminRoute';
import NewsLetterSubscribers from '../admin/NewsletterSubscribers';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/custom" element={<CustomGiftManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/newsletter" element={<NewsLetterSubscribers/>}/>
        </Route>
      </Route>

      {/* ✅ User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/buy" element={<ProductCheckout />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
