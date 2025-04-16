import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

// Import your admin components for different pages
import AdminDashboard from "../admin/AdminDashboard";
import NewsLetterSubscribers from "../admin/NewsletterSubscribers";
import UserManagement from "../admin/UserManagement";
import OrderManagement from "../admin/OrderManagement";
import Settings from "../admin/Setting";
import NewsletterSubscribers from '../admin/NewsletterSubscribers'; // This line is declared twice.
import { db } from '../firebase/config'; // Ensure this import points to the correct config file.
import { collection, getDocs } from 'firebase/firestore';
import CustomGiftManagement from "../admin/CustomOrderManagement";



const hoverLinkStyle = {
  transition: "all 0.2s ease-in-out",
  padding: "6px 10px",
  borderRadius: "5px",
  display: "inline-block",
  width: "100%",
};

const AdminLayout = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    offer: "",
    category: "Soulmates Gifts",
    attributes: "",
    returns: false,
    gst: false,
  });

  const location = useLocation(); // Get the current location to conditionally render based on path

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Determine which component to render based on the current route
  const renderAdminContent = () => {
    switch (location.pathname) {
      case "/admin":
        return <AdminDashboard />;
      case "/admin/users":
        return <UserManagement />;
      case "/admin/orders":
        return <OrderManagement />;
      case "/admin/custom":
        return <CustomGiftManagement />;
      case "/admin/newsletter":
        return <NewsletterSubscribers />; // Example for newsletter
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="d-flex">
      <div
        className="text-white p-4 vh-100"
        style={{
          width: "360px",
          backgroundColor: "#0d6efd",
          fontFamily: "Segoe UI, sans-serif",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <h4 className="mb-4 fw-bold border-bottom pb-2">Admin Dashboard</h4>
        {/* <Button variant="success" onClick={() => setShowModal(true)} className="w-100 mb-3 text-start">
          + Add Product
        </Button> */}
        <ul className="list-unstyled">
          {[{
            path: "/admin",
            icon: <FaUsers className="me-2" />, label: "Product Management"
          },
          // {
          //   path: "/admin/users",
          //   icon: <FaUsers className="me-2" />, label: "User Management"
          // },
          //  {
          //   path: "/admin/orders",
          //   icon: <FaBox className="me-2" />, label: "Order Management"
          // }, 
          {
            path: "/admin/custom",
            icon: <FaTachometerAlt className="me-2" />, label: "Customize Orders"
          }, {
            path: "/admin/newsletter",
            icon: <FaBox className="me-2" />, label: "Newsletter Subscribers"
          }].map(({ path, icon, label }) => (
            <li key={path} className="mb-3">
              <Link
                to={path}
                className="text-white text-decoration-none d-flex align-items-center"
                style={hoverLinkStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {icon} {label}
              </Link>
            </li>
          ))}
          {/* <li className="mt-4 border-top pt-3">
            <Link to="/admin/login" className="text-decoration-none d-flex align-items-center" style={{ ...hoverLinkStyle, color: "#ffc107" }}>
              <FaSignOutAlt className="me-2" /> Logout
            </Link>
          </li> */}
        </ul>
      </div>

      <div className="container-fluid mt-4">
        <div className="row">
          {renderAdminContent()} {/* Render the content based on the current route */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
