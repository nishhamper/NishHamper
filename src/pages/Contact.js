import React, { useState } from "react";
import { db, storage } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    giftCategory: "",
    customizationDetails: "",
    deliveryAddress: "",
    deliveryDate: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      if (formData.image) {
        const imageRef = ref(storage, `customGiftImages/${uuidv4()}-${formData.image.name}`);
        const snapshot = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "customGiftOrders"), {
        ...formData,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        giftCategory: "",
        customizationDetails: "",
        deliveryAddress: "",
        deliveryDate: "",
        image: null,
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://img.freepik.com/free-photo/happy-mothers-day-celebration_23-2151306158.jpg?t=st=1744753521~exp=1744757121~hmac=5ec58ca56a91e85a86aadd91db9f034ef7a7663049890776204d4b19abb78645&w=1380')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-lg border-0 rounded-4" style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.85)" }}>
              <Card.Body className="p-4 p-md-5">
                <h2 className="text-center text-primary mb-4 fw-bold">
                  ✨ Create Your Custom Gift
                </h2>

                {submitted ? (
                  <Alert variant="success" className="text-center fw-semibold">
                    ✅ Your custom order has been submitted successfully!
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Gift Category</Form.Label>
                          <Form.Select
                            name="giftCategory"
                            value={formData.giftCategory}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="Soulmates Gifts">Soulmates Gifts</option>
                            <option value="Celebrations Gifts">Celebrations Gifts</option>
                            <option value="Everyday Heroes Gifts">Everyday Heroes Gifts</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Preferred Delivery Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Customization Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        name="customizationDetails"
                        value={formData.customizationDetails}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upload Image (optional)</Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Delivery Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="d-grid">
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Custom Gift Order 🎁"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
