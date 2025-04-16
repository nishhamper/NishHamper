// src/routes/ProtectedAdminRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
