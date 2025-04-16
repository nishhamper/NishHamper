import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, updateCart, clearCart } = useCart();

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary fw-bold">
        🛍️ Your Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is empty!</div>
      ) : (
        <div className="row">
          {/* Items List */}
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div className="card mb-4 shadow-sm rounded-4 border-0" key={item.id}>
                <div className="row g-0 align-items-center">
                  <div className="col-md-4 p-3">
                    <div className="image-hover rounded-3 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid"
                        style={{ objectFit: "cover", height: "180px", width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-8 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold">{item.name}</h5>
                        <p className="text-muted mb-1">Price: ${item.price}</p>
                        <p className="text-muted mb-2">Subtotal: ${item.price * item.quantity}</p>
                        <div className="btn-group">
                          <button
                            onClick={() => updateCart(item, "decrease")}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            <FaMinus />
                          </button>
                          <span className="px-3 fs-5">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash className="me-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="col-lg-4">
            <div className="card shadow-sm rounded-4 border-0 sticky-top" style={{ top: "80px" }}>
              <div className="card-body">
                <h5 className="text-primary mb-3">🧾 Cart Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <span className="badge bg-info text-dark">{cartItems.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total Price:</span>
                  <strong className="text-success">${getTotal()}</strong>
                </div>

                <button
                  onClick={clearCart}
                  className="btn btn-outline-danger w-100 mb-2"
                >
                  <FaTrash className="me-1" />
                  Clear Cart
                </button>

                <Link
                  to="/checkout"
                  className="btn btn-success w-100 fw-bold"
                >
                  Proceed to Checkout →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
