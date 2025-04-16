// /components/ProductModal.js
import React, { useState } from "react";
import Button from "./ui/Button";

const ProductModal = ({ product, onSave, onClose }) => {
  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [image, setImage] = useState(product ? product.image : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );

  const handleSubmit = () => {
    onSave({ name, price, image, description });
    onClose();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">{product ? "Edit" : "Add"} Product</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="w-full p-2 border mb-4"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Product Price"
        className="w-full p-2 border mb-4"
      />
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Product Image URL"
        className="w-full p-2 border mb-4"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product Description"
        className="w-full p-2 border mb-4"
      />
      <div className="flex space-x-2">
        <Button
          label="Save"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        />
        <Button
          label="Cancel"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600"
        />
      </div>
    </div>
  );
};

export default ProductModal;
