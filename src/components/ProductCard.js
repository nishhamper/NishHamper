import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ product, isAdmin = false, onEdit, onDelete }) => {
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const alreadyInCart = cartItems.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();  // Prevent card click from triggering
    if (!user) {
      toast.error("🔒 Please log in to add items to your cart.", { position: "top-center" });
      return;
    }

    if (alreadyInCart) {
      toast.info("🛒 This item is already in your cart.", { position: "top-center" });
    } else {
      addToCart(product);
      toast.success("✔️ Added to cart!", { position: "top-center" });
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();  // Prevent card click from triggering
    if (!user) {
      toast.error("🔒 Please log in to proceed to checkout.", { position: "top-center" });
      return;
    }

    sessionStorage.setItem("checkoutItem", JSON.stringify(product));
    navigate("/buy");
  };

  // Calculate discount
  const price = parseFloat(product.price);
  const offer = parseFloat(product.offer);
  const hasDiscount = !isNaN(offer) && offer > 0;
  const discountPrice = hasDiscount ? (price - (price * offer) / 100).toFixed(2) : price.toFixed(2);

  // Handle card click to navigate to product details page
  const handleCardClick = () => {
    sessionStorage.setItem("productDetails", JSON.stringify(product));
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="card border-0 shadow-sm rounded-4 h-100"
      style={{
        background: "#fff",
        height: "100%",
        minHeight: "470px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.3s ease-in-out",
      }}
      onClick={handleCardClick} // Navigate on card click
      onMouseEnter={(e) => e.currentTarget.classList.add("shadow-lg")}
      onMouseLeave={(e) => e.currentTarget.classList.remove("shadow-lg")}
    >
      {/* Offer Ribbon */}
      {hasDiscount && (
        <div
          className="badge bg-danger text-white position-absolute top-0 start-0 m-2"
          style={{ padding: "5px 10px", fontSize: "0.85rem" }}
        >
          {offer}% OFF
        </div>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="card-img-top rounded-top-4"
        style={{ height: "230px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          {/* Product Name */}
          <h6 className="fw-bold text-dark">{product.name}</h6>

          {/* Category */}
          <p className="text-muted small mb-2" style={{ fontSize: "0.85rem" }}>
            {product.category}
          </p>

          {/* Price Section */}
          <div className="d-flex align-items-baseline mb-2">
            <span className="fw-bold text-danger fs-5 me-2">AUD {discountPrice}</span>
            {hasDiscount && (
              <span className="text-muted text-decoration-line-through fs-6">
                AUD {price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Product Attributes (with badge styling) */}
          {product.attributes && typeof product.attributes === "string" && (
            <div className="mb-3 d-flex flex-wrap gap-2">
              {product.attributes.split(",").map((attr, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border border-secondary rounded-pill px-3 py-1"
                  style={{ fontSize: "0.75rem", fontWeight: "500" }}
                >
                  {attr.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-auto">
          {isAdmin ? (
            <>
              <button className="btn btn-warning w-50" onClick={(e) => { e.stopPropagation(); onEdit(product); }}>
                Edit
              </button>
              <button className="btn btn-danger w-50" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn w-50 ${alreadyInCart ? "btn-secondary" : "btn-outline-dark"}`}
                onClick={handleAddToCart}
                disabled={alreadyInCart}
              >
                {alreadyInCart ? "In Cart" : "Add to Cart"}
              </button>
              <button className="btn btn-primary w-50" onClick={handleBuyNow}>
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
