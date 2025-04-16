import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";  // ✅ Adjust path if needed
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (!email || !password) {
      return setError("Please enter both email and password.");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      // Custom messages for common errors
      if (err.code === "auth/user-not-found") {
        setError("We couldn't find an account with that email. Please check your email or sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("The password you entered is incorrect. Please try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (err) {
      setError("Google login failed. Please try again later.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary fw-bold">Welcome Back!</h2>

          {error && (
            <div className="alert alert-danger text-center fw-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold">
              Login
            </button>
          </form>

          <div className="text-center my-3 text-secondary">or</div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn w-100 fw-bold d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              color: "#555",
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Sign in with Google
          </button>

          <div className="text-center mt-4 text-secondary">
            Don't have an account?{" "}
            <a href="/signup" className="text-decoration-none text-primary fw-semibold">
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
