import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import CustomGiftRow from "./CustomGiftRow"; // or wherever you place it



const ProductHistory = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [orders, setOrders] = useState([]);
  const [customGifts, setCustomGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  const fetchCustomGifts = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "customGiftOrders"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const customGiftList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomGifts(customGiftList);
    } catch (err) {
      console.error("Failed to fetch custom gifts:", err);
    }
  };

  fetchCustomGifts();
}, [user]);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Fetch Custom Gifts
  useEffect(() => {
    const fetchCustomGifts = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "customGifts"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const gifts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomGifts(gifts);
      } catch (err) {
        console.error("Error fetching custom gifts:", err);
      }
    };

    fetchCustomGifts();
  }, [user]);

  const Card = ({ item, isGift = false }) => (
    <div
      className="card shadow-sm border-0"
      style={{
        minWidth: "200px",
        maxWidth: "200px",
        height: isGift ? "360px" : "280px",
        borderRadius: "16px",
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={item.image}
        alt={item.name}
        className="card-img-top"
        style={{
          height: "140px",
          objectFit: "cover",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      />
      <div className="card-body d-flex flex-column justify-content-between p-3" style={{ flex: 1 }}>
        <div>
          <h6 className="card-title mb-1 text-truncate" title={item.name}>{item.name}</h6>
          {isGift ? (
            <span className={`badge ${
              item.status === "pending" ? "bg-warning text-dark" :
              item.status === "approved" ? "bg-primary" :
              "bg-success"
            }`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          ) : (
            <>
              <small className="text-muted d-block text-truncate">Category: {item.category}</small>
              <small className="text-muted">Qty: {item.quantity}</small>
            </>
          )}
        </div>
        <div className="fw-bold text-primary mt-2">
          ${item.price * (item.quantity || 1)}
        </div>
      </div>
    </div>
  );

  if (!user) return <div className="text-center mt-5">Please log in to view your profile.</div>;
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container py-5">
      {/* Cart */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-secondary">🛒 My Cart</h4>
          <Link to="/cart" className="btn btn-outline-primary btn-sm">Go to Cart</Link>
        </div>
        {cartItems.length === 0 ? (
          <p className="text-muted">Your cart is empty.</p>
        ) : (
          <div className="d-flex overflow-auto gap-3 pb-2">
            {cartItems.slice(0, 5).map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Custom Gifts */}
      {/* <YourCartComponent /> */}
{/* <CustomGiftRow user={currentUser} /> */}
{/* <OrderHistoryComponent /> */}
{/* Custom Gift Orders */}
{/* Custom Gift Orders Section */}
{customGifts.length > 0 && (
  <div className="mb-5">
    <h4 className="text-secondary mb-3">🎁 My Custom Gifts</h4>
    <div className="d-flex overflow-auto gap-3 pb-2" style={{ whiteSpace: "nowrap" }}>
      {customGifts.map((gift) => (
        <div
          key={gift.id}
          className="card shadow-sm border-0"
          style={{
            minWidth: "200px",
            maxWidth: "200px",
            height: "320px",
            borderRadius: "16px",
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={gift.image}
            alt={gift.name}
            className="card-img-top"
            style={{
              height: "140px",
              objectFit: "cover",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          />
          <div className="card-body d-flex flex-column justify-content-between p-3" style={{ flex: 1 }}>
            <div>
              <h6 className="card-title mb-1 text-truncate" title={gift.name}>
                {gift.name}
              </h6>
              <small className="text-muted d-block text-truncate" title={gift.category}>
                Category: {gift.category}
              </small>
            </div>
            <div>
              <span
                className={`badge ${
                  gift.status === "pending"
                    ? "bg-warning text-dark"
                    : gift.status === "approved"
                    ? "bg-info text-dark"
                    : "bg-success"
                }`}
              >
                {gift.status.charAt(0).toUpperCase() + gift.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}




      {/* Order History */}
      <div>
        <h4 className="text-secondary mb-3">📦 Order History</h4>
        {orders.length === 0 ? (
          <p className="text-muted">No past orders found.</p>
        ) : (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              return (
                <div key={order.id} className="border rounded p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
                    <div className="text-dark fw-semibold">
                      {order.createdAt?.toDate().toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    <div className="fw-bold text-primary mt-2 mt-md-0">Total: ${total}</div>
                  </div>
                  <div className="d-flex overflow-auto gap-3 pb-2">
                    {order.items.map((item, idx) => (
                      <Card key={idx} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHistory;
