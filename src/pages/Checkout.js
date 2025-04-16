import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase/config';
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const { cartItems, clearCart, updateCart } = useCart();
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

    if (cartItems.length === 0) {
      toast.warning('🛒 Your cart is empty!');
      return;
    }

    setLoading(true);

    const order = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || name,
      items: [...cartItems],
      shippingDetails,
      total: getTotal(),
      createdAt: serverTimestamp(),
    };

    try {
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, order);

      clearCart();
      toast.success('✅ Order placed successfully!');
      setShippingDetails({ name: '', address: '', email: '', phone: '' });
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setShippingDetails({
          name: user.displayName || data.name || '',
          email: user.email || data.email || '',
          phone: data.number || '',
          address: data.shippingAddressSameAsProfile
            ? data.address || ''
            : data.shippingAddress || '',
        });
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="text-primary fw-bold">🛒 Checkout</h2>
        <p className="text-muted">All items in your cart will be ordered together</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is empty.</div>
      ) : (
        <div className="row">
          {/* Cart Summary */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Cart Summary</h5>
              </div>
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        marginRight: 10,
                      }}
                      className="rounded shadow-sm"
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateCart(item, 'decrease')}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateCart(item, 'increase')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="fw-bold text-primary ms-2">
                      ${item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="card-footer text-end fw-bold fs-5 text-success">
                Total: ${getTotal()}
              </div>
            </div>
          </div>

          {/* Shipping Form */}
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
                    {loading ? 'Placing Order...' : 'Place Order for All Items'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
