import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            alt="Giftly Logo"
            width="90"
            height="45"
            style={{ objectFit: "cover" }}
          />
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navMenu">
          <ul className="navbar-nav align-items-center gap-3 fw-semibold">

            {/* Home */}
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link text-dark ${
                  location.pathname === "/" ? "active bg-primary text-white rounded-pill px-3 py-2" : ""
                }`}
              >
                Home
              </Link>
            </li>

            {/* About */}
            <li className="nav-item">
              <Link
                to="/about"
                className={`nav-link text-dark ${
                  location.pathname === "/about" ? "active bg-primary text-white rounded-pill px-3 py-2" : ""
                }`}
              >
                About
              </Link>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link text-dark ${
                  location.pathname === "/contact" ? "active bg-primary text-white rounded-pill px-3 py-2" : ""
                }`}
              >
                Customize
              </Link>
            </li>

            {/* Category Dropdown */}
            <li className="nav-item dropdown">
              <Link
                to="#"
                className={`nav-link dropdown-toggle text-dark ${
                  location.pathname.includes("/category") ? "active bg-primary text-white rounded-pill px-3 py-2" : ""
                }`}
                id="categoryDropdown"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                Categories
              </Link>
              <ul className="dropdown-menu shadow">
                <li>
                  <Link className="dropdown-item" to="/category/couples">Couples</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/celebrations">Celebrations</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/heroes">Everyday Heroes</Link>
                </li>
              </ul>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link
                to="/cart"
                className={`nav-link text-dark position-relative ${
                  location.pathname === "/cart" ? "active bg-primary text-white rounded-pill px-3 py-2" : ""
                }`}
              >
                Cart
                {cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>

            {/* Profile or Login */}
            <li className="nav-item">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.displayName || "My Profile"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li>
                      <Link className="dropdown-item" to="/profile">Profile</Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary px-4">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
