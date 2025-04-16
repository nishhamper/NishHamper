import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { Button, Spinner, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const NewsLetterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("🎉 Happy Weekend! Get 20% off on your favorite gifts! 🎁");
  const [message, setMessage] = useState("We hope you're having an amazing weekend! As a special treat, we're offering you **20% off** on our custom gift categories!");
  const [discountCategory, setDiscountCategory] = useState("Custom Gifts");

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "subscribers"));
        const subscriberData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name || "Valued Subscriber",
        }));
        setSubscribers(subscriberData);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const sendNewsletterEmail = (email, name) => {
    const templateParams = {
      to_email: email,
      subject: subject,
      message: message,
      name: name,
      discountCategory: discountCategory,
    };

    emailjs
      .send("service_suc5oim", "template_hg3cz3q", templateParams, "GZrZqCc-maOgXBMLO")
      .then(
        (result) => {
          console.log("Newsletter email sent successfully to:", email);
        },
        (error) => {
          console.log("Error sending email to:", email, error.text);
        }
      );
  };

  const sendNewsletterToAll = () => {
    if (!subject || !message || !discountCategory) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please make sure all fields are filled out.",
      });
      return;
    }

    setLoading(true);
    subscribers.forEach((subscriber) => {
      sendNewsletterEmail(subscriber.email, subscriber.name);
    });

    Swal.fire({
      icon: "success",
      title: "Emails Sent Successfully",
      text: "The newsletter has been sent to all subscribers.",
    });
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">📧 Newsletter Management</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Write your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Discount Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter discount category"
            value={discountCategory}
            onChange={(e) => setDiscountCategory(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        onClick={sendNewsletterToAll}
        disabled={loading}
        className="w-100 mt-4"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Sending...
          </>
        ) : (
          "Send Newsletter to All Subscribers"
        )}
      </Button>
      <div className="mt-4">
        <h5>Subscribers List:</h5>
        <ul className="list-unstyled">
          {subscribers.map((subscriber) => (
            <li key={subscriber.id} className="mb-2">
              <strong>{subscriber.name}</strong> - {subscriber.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsLetterSubscribers;
