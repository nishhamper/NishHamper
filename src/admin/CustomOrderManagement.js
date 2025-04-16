import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query
} from "firebase/firestore";
import { Button, Modal, Form, Badge } from "react-bootstrap";
import emailjs from "@emailjs/browser";

const CustomGiftManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "customGiftOrders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching custom gift orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const sendEmail = (email, status, name, giftCategory, deliveryDate, deliveryAddress) => {
    let subject, message;

    // Set the subject and message based on the order status
    if (status === "Approved") {
      subject = "Your Custom Gift Order Has Been Approved 🎁";
      message = `
        Hello ${name},

        We're excited to let you know that your custom gift order has been **approved**! 🎉
        Our team is now preparing your gift with great care and creativity.

        📝 Order Details:
        • Category: ${giftCategory}
        • Delivery Date: ${deliveryDate}
        • Delivery Address: ${deliveryAddress}

        We will keep you updated on the progress and notify you once your order has been dispatched or delivered.

        Thank you for choosing Giftly!

        Best regards,
        The Giftly Team
      `;
    } else if (status === "Delivered") {
      subject = "Your Custom Gift Order Has Been Delivered 🚚";
      message = `
        Hello ${name},

        We're happy to inform you that your custom gift order has been **successfully delivered**! 🎁✨
        We hope it brings joy and smiles to you and your loved ones.

        📝 Order Summary:
        • Category: ${giftCategory}
        • Delivered To: ${deliveryAddress}
        • Delivery Date: ${deliveryDate}

        We'd love to hear your feedback! If you enjoyed our service, consider leaving us a review or sharing your experience.

        Thank you for trusting Giftly for your special moments!

        Warm wishes,
        The Giftly Team
      `;
    }

    // Prepare template parameters
    const templateParams = {
      to_email: email,
      subject: subject,
      message: message,
      name: name, // Add other parameters if necessary
    };

    // Send email using EmailJS service
    emailjs
      .send("service_suc5oim", "template_hg3cz3q", templateParams, "GZrZqCc-maOgXBMLO")
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
        },
        (error) => {
          console.log("Error sending email:", error.text);
        }
      );
  };

  const handleStatusUpdate = async (id, newStatus, email) => {
    const ref = doc(db, "customGiftOrders", id);
    await updateDoc(ref, { status: newStatus });
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    // Send email on status change (Approved or Rejected)
    if (newStatus === "Approved") {
      sendEmail(
        email,
        "Approved",
        selectedOrder.name,
        selectedOrder.giftCategory,
        selectedOrder.deliveryDate,
        selectedOrder.deliveryAddress
      );
    }
  };

  const handleDeliveryUpdate = async (id, newStatus, email) => {
    const ref = doc(db, "customGiftOrders", id);
    await updateDoc(ref, { deliveryStatus: newStatus });
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, deliveryStatus: newStatus } : order
      )
    );

    // Send email when order is delivered
    if (newStatus === "Delivered") {
      sendEmail(
        email,
        "Delivered",
        selectedOrder.name,
        selectedOrder.giftCategory,
        selectedOrder.deliveryDate,
        selectedOrder.deliveryAddress
      );
    }
  };

  const openModal = order => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const statusColors = {
    Approved: "success",
    Pending: "warning",
    Rejected: "danger"
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">🎁 Custom Gift Order Management</h3>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.email}</td>
                <td>{order.name}</td>
                <td>{order.giftCategory}</td>
                <td>{order.createdAt?.toDate().toLocaleString()}</td>
                <td>
                  <Badge bg={statusColors[order.status] || "secondary"}>
                    {order.status || "Pending"}
                  </Badge>
                </td>
                <td>{order.deliveryStatus || "Not Started"}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => openModal(order)}>
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Custom Order</Modal.Title>
        </Modal.Header>
        {selectedOrder && (
          <Modal.Body>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Name:</strong> {selectedOrder.name}</p>
            <p><strong>Category:</strong> {selectedOrder.giftCategory}</p>
            <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
            <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
            <p><strong>Message:</strong> {selectedOrder.customizationDetails}</p>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={selectedOrder.status || "Pending"}
                onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value, selectedOrder.email)}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Delivery Status</Form.Label>
              <Form.Select
                value={selectedOrder.deliveryStatus || "Not Started"}
                onChange={(e) => handleDeliveryUpdate(selectedOrder.id, e.target.value, selectedOrder.email)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Delivered</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomGiftManagement;
