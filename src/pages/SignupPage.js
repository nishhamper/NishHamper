import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      name,
      email,
      number,
      password,
      confirmPassword,
    } = form;

    if (!name || !email || !number || !password || !confirmPassword) {
      return setError("Please fill out all the required fields.");
    }
    if (password.length < 6) {
      return setError("Password should be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      return setError("Oops! Passwords do not match.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate("/profile");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light" style={{ overflow: "hidden" }}>
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "500px", overflowY: "auto", maxHeight: "95vh", borderRadius: "1rem", scrollbarWidth: "none" }}>
        <div className="card-body">
          <h3 className="text-center text-primary fw-bold mb-4">Register Your Account</h3>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="needs-validation">
            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number *</label>
              <input type="text" className="form-control" name="number" value={form.number} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">State</label>
                <input type="text" className="form-control" name="state" value={form.state} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Postcode</label>
                <input type="text" className="form-control" name="postcode" value={form.postcode} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Country</label>
              <input type="text" className="form-control" name="country" value={form.country} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Password *</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password *</label>
              <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
              Sign Up
            </button>
          </form>

          <div className="mt-3 text-center">
            Already have an account? <a href="/login" className="text-decoration-none fw-semibold">Sign In & Register</a>
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
