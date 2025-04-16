import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

const AdminUpload = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: ""
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    try {
      await addDoc(collection(db, "products"), {
        ...product,
        price: parseFloat(product.price)
      });
      alert("Product uploaded successfully!");
      setProduct({ name: "", price: "", description: "", imageUrl: "" });
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload New Product</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />
      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={product.imageUrl}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload Product
      </button>
    </div>
  );
};

export default AdminUpload;
