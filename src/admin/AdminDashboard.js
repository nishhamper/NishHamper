import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    offer: "",
    category: "Soulmates Gifts",
    attributes: "",
    returns: false,
    gst: false,
  });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const { price, offer } = formData;
    let discountPrice = price;

    if (offer && offer.includes("%")) {
      const percentage = parseFloat(
        offer.replace("%", "").replace("Off", "").trim()
      );
      if (!isNaN(percentage)) {
        discountPrice = (price - (price * percentage) / 100).toFixed(2);
      }
    }

    const productData = {
      ...formData,
      price: parseFloat(price),
      discountPrice: parseFloat(discountPrice),
    };

    if (editId) {
      const docRef = doc(db, "products", editId);
      await updateDoc(docRef, productData);
    } else {
      await addDoc(collection(db, "products"), productData);
    }

    fetchProducts();
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      offer: "",
      category: "Soulmates Gifts",
      attributes: "",
      returns: false,
      gst: false,
    });
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  return (
<div className="container-fluid py-5 px-4 admin-dashboard-container">
<div className="d-flex justify-content-between align-items-center mb-4">
  <h2 className="mb-0">Admin Dashboard</h2>
  <Button variant="primary" onClick={() => setShowModal(true)}>
    + Add Product
  </Button>
</div>


      <div className="row product-cards">
        {products.map((product) => (
          <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
            <ProductCard
              product={product}
              isAdmin
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
            />
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Product */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Form onSubmit={handleAddOrUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? "Edit Product" : "Add Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="Soulmates Gifts">Soulmates Gifts</option>
                    <option value="Celebrations Gifts">Celebrations Gifts</option>
                    <option value="Everyday Heroes Gifts">Everyday Heroes Gifts</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter product description"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Enter product price"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formImage">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Enter image URL"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formOffer">
                  <Form.Label>Offer (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.offer}
                    onChange={(e) =>
                      setFormData({ ...formData, offer: e.target.value })
                    }
                    placeholder="e.g. 20% Off"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formAttributes">
              <Form.Label>Attributes (Type, Material, Personalization)</Form.Label>
              <Form.Control
                type="text"
                value={formData.attributes}
                onChange={(e) =>
                  setFormData({ ...formData, attributes: e.target.value })
                }
                placeholder="e.g., Minimalist, Gold, Custom"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formReturns">
                  <Form.Check
                    type="checkbox"
                    label="Returns & Exchanges Accepted"
                    checked={formData.returns}
                    onChange={(e) =>
                      setFormData({ ...formData, returns: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formGST">
                  <Form.Check
                    type="checkbox"
                    label="Seller GST Included"
                    checked={formData.gst}
                    onChange={(e) =>
                      setFormData({ ...formData, gst: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="btn-close-modal"
            >
              Close
            </Button>
            <Button variant="primary" type="submit" className="btn-submit-modal">
              {editId ? "Update Product" : "Add Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

