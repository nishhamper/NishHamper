import React, { useEffect, useState } from "react";
import { db } from "../firebase/config"; // Ensure Firebase is correctly configured
import { collection, getDocs } from "firebase/firestore";
import { Table, Badge, Spinner, Alert } from "react-bootstrap";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching Orders, Products, and Users in Parallel
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [ordersSnapshot, productsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "products")),
        getDocs(collection(db, "users"))
      ]);

      // Parse the data
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Orders:", ordersData); // Debugging log
      console.log("Fetched Products:", productsData); // Debugging log
      console.log("Fetched Users:", usersData); // Debugging log

      // Update state with fetched data
      setOrders(ordersData);
      setProducts(productsData);
      setUsers(usersData);
      setError(null); // Reset error on successful fetch
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("There was an issue fetching the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to find product by ID
  const getProductById = (productId) => {
    const product = products.find((product) => product.id === productId);
    console.log("Product ID:", productId, " - Found Product:", product); // Debugging log
    return product;
  };

  // Helper function to find user by ID
  const getUserById = (userId) => {
    const user = users.find((user) => user.id === userId);
    console.log("User ID:", userId, " - Found User:", user); // Debugging log
    return user;
  };

  // Display loading spinner or error message
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  // Display error message if there's an issue with data fetching
  if (error) {
    return (
      <div className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3 className="mb-4">📊 Order Management</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Order Date</th>
            <th>Added to Cart</th>
            <th>Purchased</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const product = getProductById(order.productId);
              const user = getUserById(order.userId);

              if (!product || !user) {
                return (
                  <tr key={order.id}>
                    <td colSpan="7" className="text-center">
                      Data missing for order ID: {order.id}. Product or User not found.
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={order.id}>
                  <td>{user.name || "Unknown User"}</td>
                  <td>{product.name || "Product not found"}</td>
                  <td>{product.category || "No category"}</td>
                  <td>${product.price || "N/A"}</td>
                  <td>{order.purchaseDate || "N/A"}</td>
                  <td>
                    {product.addedToCartUsers && product.addedToCartUsers.includes(order.userId) ? (
                      <Badge bg="info">Yes</Badge>
                    ) : (
                      <Badge bg="secondary">No</Badge>
                    )}
                  </td>
                  <td>
                    {product.purchasedByUsers && product.purchasedByUsers.includes(order.userId) ? (
                      <Badge bg="success">Yes</Badge>
                    ) : (
                      <Badge bg="warning">No</Badge>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManagement;
