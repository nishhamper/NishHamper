import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Card, Badge, Row, Col } from "react-bootstrap";

const CustomGiftRow = ({ user }) => {
  const [customGifts, setCustomGifts] = useState([]);

  useEffect(() => {
    if (!user?.email) return;
    const q = query(
      collection(db, "customGiftOrders"),
      where("email", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomGifts(data);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "delivered":
        return "info";
      default:
        return "warning";
    }
  };

  if (!customGifts.length) return null;

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">🎨 Your Custom Gift Orders</h5>
      <Row className="flex-nowrap overflow-auto" style={{ gap: "1rem" }}>
        {customGifts.map((gift) => (
          <Col
            key={gift.id}
            style={{ minWidth: "250px", maxWidth: "300px" }}
          >
            <Card className="h-100 shadow-sm border-0">
              {gift.imageUrl && (
                <Card.Img
                  variant="top"
                  src={gift.imageUrl}
                  alt="Custom Gift"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title className="mb-1">{gift.giftCategory}</Card.Title>
                <Card.Text style={{ fontSize: "0.9rem" }}>
                  {gift.customizationDetails}
                </Card.Text>
                <Badge bg={getStatusVariant(gift.status || "pending")}>
                  {gift.status ? gift.status.toUpperCase() : "PENDING"}
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CustomGiftRow;
