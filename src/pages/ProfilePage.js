import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button, Modal, Form } from "react-bootstrap";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import ProductHistory from "../components/ProductHistory";


const ProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    number: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    shippingAddressSameAsProfile: true, // Ensuring it's true by default
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
  });

  const requiredFields = ["number", "address", "city", "state", "postcode", "country"];
  const isProfileComplete = requiredFields.every((field) => userData?.[field]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
  
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const data = userSnap.data();
  
        const defaultShippingSameAsProfile = data.shippingAddressSameAsProfile ?? true;
  
        const updatedFormState = {
          number: data.number || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          postcode: data.postcode || "",
          country: data.country || "",
          shippingAddressSameAsProfile: defaultShippingSameAsProfile, // Keep it true by default
          shippingAddress: defaultShippingSameAsProfile ? data.address || "" : data.shippingAddress || "",
          shippingCity: defaultShippingSameAsProfile ? data.city || "" : data.shippingCity || "",
          shippingState: defaultShippingSameAsProfile ? data.state || "" : data.shippingState || "",
          shippingPostcode: defaultShippingSameAsProfile ? data.postcode || "" : data.shippingPostcode || "",
          shippingCountry: defaultShippingSameAsProfile ? data.country || "" : data.shippingCountry || "",
        };
  
        setUserData(data);
        setFormState(updatedFormState);
      }
    };
  
    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingToggle = (e) => {
    const { checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      shippingAddressSameAsProfile: checked,
      ...(checked && {
        shippingAddress: userData?.address || "",
        shippingCity: userData?.city || "",
        shippingState: userData?.state || "",
      }),
    }));
  };

  const saveProfile = async () => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { ...formState }, { merge: true });
    setUserData((prev) => ({ ...prev, ...formState }));
    setShowModal(false);
  };

  const saveShippingAddress = async () => {
    const { shippingAddress, shippingCity, shippingState, shippingAddressSameAsProfile } = formState;
    const shippingData = { shippingAddress, shippingCity, shippingState, shippingAddressSameAsProfile };
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, shippingData, { merge: true });
    setUserData((prev) => ({ ...prev, ...shippingData }));
    alert("Shipping address saved!");
  };

  if (!user) return <div className="text-center mt-5">Please log in to view your profile.</div>;

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-lg border-0 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
              style={{ width: 70, height: 70, fontSize: 28 }}
            >
              {user.displayName ? user.displayName.charAt(0) : "U"}
            </div>
            <div className="ms-3">
              <h4 className="mb-1">{user.displayName || "Unnamed User"}</h4>
              <p className="text-muted mb-0">{user.email}</p>
            </div>
          </div>
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            {isProfileComplete ? "Edit Profile" : "Complete Profile"}
          </Button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <ProfileField label="Phone" value={userData?.number} />
            <ProfileField label="Address" value={userData?.address} />
            <ProfileField label="City" value={userData?.city} />
          </div>
          <div className="col-md-6 mb-3">
            <ProfileField label="State" value={userData?.state} />
            <ProfileField label="Postcode" value={userData?.postcode} />
            <ProfileField label="Country" value={userData?.country} />
          </div>
        </div>

        <hr className="my-4" />
        <h5>Shipping Address</h5>
        <Form.Check
          type="checkbox"
          label="Use the same address as profile address"
          checked={formState.shippingAddressSameAsProfile}
          onChange={handleShippingToggle}
        />

        {formState.shippingAddressSameAsProfile ? (
          <div className="mt-3 text-muted">
            <p><strong>Using Profile Address for Shipping</strong></p>
            <p>{userData?.address}, {userData?.city}, {userData?.state}</p>
          </div>
        ) : (
          <div className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                type="text"
                name="shippingAddress"
                value={formState.shippingAddress}
                onChange={handleInputChange}
                placeholder="Enter your shipping address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Shipping City</Form.Label>
              <Form.Control
                type="text"
                name="shippingCity"
                value={formState.shippingCity}
                onChange={handleInputChange}
                placeholder="Enter your shipping city"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Shipping State</Form.Label>
              <Form.Control
                type="text"
                name="shippingState"
                value={formState.shippingState}
                onChange={handleInputChange}
                placeholder="Enter your shipping state"
              />
            </Form.Group>

            <Button variant="success" onClick={saveShippingAddress}>
              Save Shipping Address
            </Button>
          </div>
        )}

        {!isProfileComplete && (
          <div className="alert alert-warning mt-3 rounded-3 shadow-sm">
            ⚠️ Some profile fields are missing. Please complete your profile to continue ordering.
          </div>
        )}
      </div>
      <div className="mt-5">
        
  <ProductHistory />
</div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isProfileComplete ? "Edit Profile" : "Complete Your Profile"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {requiredFields.map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="text-capitalize">{field}</Form.Label>
                <Form.Control
                  type="text"
                  name={field}
                  value={formState[field]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveProfile}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <p className="mb-2">
    <strong>{label}:</strong>{" "}
    {value ? <span>{value}</span> : <span className="text-danger"></span>}
  </p>
);

export default ProfilePage;
