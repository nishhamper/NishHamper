import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      const productDocRef = doc(db, "products", id);
      const productSnapshot = await getDoc(productDocRef);

      if (productSnapshot.exists()) {
        const data = productSnapshot.data();
        setProduct(data);
        setSelectedImage(data.image);
        setReviews(data.reviews || []);
      } else {
        toast.error("Product not found!");
      }
    };

    fetchProductData();
  }, [id]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  const alreadyInCart = cartItems.some(item => item.id === product.id);

  const price = parseFloat(product.price);
  const offer = parseFloat(product.offer);
  const hasDiscount = !isNaN(offer) && offer > 0;
  const discountedPrice = hasDiscount ? price - (price * offer) / 100 : price;
  const finalPrice = discountedPrice.toFixed(2);
  const gst = (discountedPrice * 0.13).toFixed(2); // Assuming 13% GST

  const handleAddToCart = () => {
    if (!user) return toast.error("🔒 Please log in to add items to your cart.");
    if (alreadyInCart) return toast.info("🛒 Already in cart.");
    addToCart(product);
    toast.success("✔️ Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) return toast.error("🔒 Please log in to proceed.");
    sessionStorage.setItem("checkoutItem", JSON.stringify(product));
    navigate("/buy");
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    const newReview = {
      user: user.displayName || user.email,
      rating,
      comment,
      timestamp: new Date(),
    };

    const productDocRef = doc(db, "products", id);
    await updateDoc(productDocRef, {
      reviews: arrayUnion(newReview),
    });

    setReviews(prev => [...prev, newReview]);
    setRating(0);
    setComment("");
    toast.success("✔️ Review submitted!");
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={selectedImage}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <div className="d-flex gap-2 mt-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                className={`img-thumbnail ${selectedImage === img ? "border-primary" : ""}`}
                style={{ height: "70px", width: "70px", cursor: "pointer", objectFit: "cover" }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2 className="fw-bold text-dark">{product.name}</h2>
          <p className="text-muted mb-2">{product.category}</p>

          <div className="d-flex align-items-center mb-2">
            <h4 className="text-danger me-3">AUD {finalPrice}</h4>
            {hasDiscount && (
              <>
                <span className="text-muted text-decoration-line-through">AUD {price.toFixed(2)}</span>
                <span className="badge bg-success ms-2">{offer}% OFF</span>
              </>
            )}
          </div>

          <p className="mb-2 text-secondary">Incl. GST: AUD {gst}</p>
          <p className="text-muted">{product.description}</p>

          {/* Specifications */}
          {product.attributes && typeof product.attributes === "string" && (
            <div className="mb-3">
              <h6 className="fw-bold">Specifications</h6>
              <ul>
                {product.attributes.split(",").map((attr, idx) => (
                  <li key={idx}>{attr.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Return Policy */}
          <div className="bg-light border p-3 rounded mb-4">
            <strong>✅ 7 Days Return Policy</strong>
            <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
              Easy returns within 7 days of delivery. Product must be unused.
            </p>
          </div>

          <div className="d-flex gap-2">
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
          </div>
        </div>
      </div>

      {/* Review Section */}
      {/* Review Section */}
<div className="mt-5">
  <h4 className="mb-4 border-bottom pb-2">Customer Reviews</h4>

  {/* Display Other Users' Reviews */}
  {reviews.length === 0 ? (
    <p className="text-muted">No reviews yet. Be the first!</p>
  ) : (
    reviews
      .filter(rev => rev.user !== (user?.displayName || user?.email))
      .slice()
      .reverse()
      .map((rev, i) => (
        <div key={i} className="border rounded p-3 mb-3 bg-white shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong>{rev.user}</strong>
            <div>
              {[...Array(5)].map((_, j) => (
                <span
                  key={j}
                  style={{
                    color: j < rev.rating ? "#f4c430" : "#ccc",
                    fontSize: "16px",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="mb-1">{rev.comment}</p>
          <small className="text-muted">
            {rev.timestamp?.seconds
              ? new Date(rev.timestamp.seconds * 1000).toLocaleDateString()
              : new Date(rev.timestamp).toLocaleDateString()}
          </small>
        </div>
      ))
  )}

  {/* Leave Review - Only if user hasn't reviewed yet */}
  {user && !reviews.some(r => r.user === (user.displayName || user.email)) && (
    <div className="p-4 bg-light rounded border shadow-sm mb-4 mt-4">
      <h6 className="mb-3">Write a Review</h6>
      <div className="d-flex mb-2 gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              cursor: "pointer",
              fontSize: "22px",
              color: star <= rating ? "#f4c430" : "#ccc",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="form-control mb-3"
        rows="3"
        placeholder="Describe your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn btn-sm btn-dark px-4" onClick={handleReviewSubmit}>
        Submit
      </button>
    </div>
  )}

  {/* Show User's Own Review at Bottom */}
  {user && reviews.some(r => r.user === (user.displayName || user.email)) && (
    <div className="mt-4 border rounded p-3 bg-white shadow-sm">
      <h6 className="mb-2">Your Review</h6>
      {reviews
        .filter(r => r.user === (user.displayName || user.email))
        .map((rev, i) => (
          <div key={i}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong>{rev.user}</strong>
              <div>
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    style={{
                      color: j < rev.rating ? "#f4c430" : "#ccc",
                      fontSize: "16px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="mb-1">{rev.comment}</p>
            <small className="text-muted">
              {rev.timestamp?.seconds
                ? new Date(rev.timestamp.seconds * 1000).toLocaleDateString()
                : new Date(rev.timestamp).toLocaleDateString()}
            </small>
          </div>
        ))}
    </div>
  )}
</div>

    </div>
  );
};

export default ProductDetails;
