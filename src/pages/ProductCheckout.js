import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext'; // Import the CartContext

const ProductCheckout = () => {
  const { cartItems, updateCart } = useCart();  // Using the CartContext to get cart items
  const [product, setProduct] = useState(null); // Store the single product
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkoutItem = sessionStorage.getItem("checkoutItem");
    if (checkoutItem) {
      const parsedProduct = JSON.parse(checkoutItem);
      setProduct(parsedProduct);  // Set the selected product for checkout
    } else {
      navigate('/');
    }
  }, [navigate]);

  const getTotal = () => {
    return product ? product.price * product.quantity : 0;  // Calculate the total based on quantity and price
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, address, email, phone } = shippingDetails;

    if (!name || !address || !email || !phone) {
      toast.error('🚨 Please fill in all shipping details!');
      return;
    }

    if (!/^\d{7,15}$/.test(phone)) {
      toast.warning('📞 Invalid phone number!');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.info('🔐 Please log in first!');
      return;
    }

    if (!product) {
      toast.warning('🛒 No product to checkout!');
      return;
    }

    setLoading(true);

    const order = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || name,
      items: [product],
      shippingDetails,
      total: getTotal(),
      createdAt: serverTimestamp(),
    };

    try {
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, order);

      sessionStorage.removeItem("checkoutItem");  // Clear the sessionStorage
      toast.success('✅ Order placed successfully!');
      setShippingDetails({ name: '', address: '', email: '', phone: '' });
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="text-primary fw-bold">🛒 Checkout</h2>
        <p className="text-muted">You are purchasing the following item</p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Product Summary</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li key={product.id} className="list-group-item d-flex align-items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 10 }}
                  className="rounded shadow-sm"
                />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1">{product.name}</h6>
                  <span className="text-muted">{product.description}</span>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <span>Quantity: {product.quantity}</span> {/* Showing the quantity here */}
                  </div>
                </div>
                <span className="fw-bold text-primary ms-2">
                  Rs. {product.price * product.quantity} {/* Price multiplied by quantity */}
                </span>
              </li>
            </ul>
            <div className="card-footer text-end fw-bold fs-5 text-success">
              Total: Rs. {getTotal()} {/* Showing the total price */}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Shipping Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {['name', 'address', 'email', 'phone'].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      className="form-control"
                      value={shippingDetails[field]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="btn btn-success w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCheckout;
