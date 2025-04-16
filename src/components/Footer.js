import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return setStatus("Please enter an email");

    try {
      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
      });
      setStatus("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("Failed to subscribe. Try again later.");
    }
  };

  const currentYear = new Date().getFullYear();
  const hrStyle = { width: "60px", backgroundColor: "#f4623a", height: "2px" };

  const exploreLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Customize" },
    { to: "/profile", label: "Profile" },
  ];

  const categoryLinks = [
    { to: "/category/couples", label: "For Couples" },
    { to: "/category/celebrations", label: "Celebrations" },
    { to: "/category/heroes", label: "Everyday Heroes" },
  ];

  const socialIcons = [
    { icon: "facebook-f", link: "#" },
    { icon: "twitter", link: "#" },
    { icon: "instagram", link: "#" },
    { icon: "youtube", link: "#" },
  ];

  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Logo & About */}
          <div className="col-md-3 mb-4">
            <Link to="/" className="d-flex align-items-center mb-2 text-decoration-none">
              <img src={logo} alt="Giftly Logo" width="144" height="144" className="me-2" />
            </Link>
            <p className="text-white-50">
              Discover heartfelt gifts for any occasion. Crafted with love, delivered with joy.
            </p>
          </div>

          {/* Explore */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase fw-bold">Explore</h6>
            <hr style={hrStyle} />
            {exploreLinks.map(({ to, label }) => (
              <p key={label}>
                <Link to={to} className="text-white-50 text-decoration-none">{label}</Link>
              </p>
            ))}
          </div>

          {/* Categories */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase fw-bold">Categories</h6>
            <hr style={hrStyle} />
            {categoryLinks.map(({ to, label }) => (
              <p key={label}>
                <Link to={to} className="text-white-50 text-decoration-none">{label}</Link>
              </p>
            ))}
          </div>

          {/* Newsletter & Social */}
          <div className="col-md-4 col-lg-5 col-xl-5 mb-4">
            <h6 className="text-uppercase fw-bold">Stay Connected</h6>
            <hr className="mb-2 mt-0 d-inline-block" style={hrStyle} />
            <form onSubmit={handleSubscribe} className="mb-3">
              <input
                type="email"
                className="form-control me-2 mb-2"
                placeholder="Subscribe to our newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-warning" type="submit">Subscribe</button>
            </form>
            {status && <p className="text-white-50">{status}</p>}
            <div>
              {socialIcons.map(({ icon, link }) => (
                <Link key={icon} to={link} className="text-white me-3 fs-5">
                  <i className={`fab fa-${icon}`}></i>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4">
          <div className="col text-center">
            <p className="text-white-50 mb-0">
              &copy; {currentYear} <strong>Nish Hamper</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
