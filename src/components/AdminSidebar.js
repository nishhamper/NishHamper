// AdminSidebar.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt } from 'react-icons/fa'; // Add icons if needed

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
      </div>
      <div className="sidebar-links">
        <ul>
          <li>
            <Link to="/admin/products">
              <FaBox /> Product Management
            </Link>
          </li>
          <li>
            <Link to="/admin/orders">
              <FaBox /> Order Management
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <FaUsers /> User Management
            </Link>
          </li>
          <li>
            <Link to="/admin/settings">
              <FaTachometerAlt /> Settings
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <FaSignOutAlt /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
