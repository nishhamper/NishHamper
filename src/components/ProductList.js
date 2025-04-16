// /pages/ProductList.js

import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // Reusable product card

const ProductList = () => {
  const [products, setProducts] = useState([]); // Placeholder for products (to be fetched from your database)

  useEffect(() => {
    // Fetch products from your database (Firebase, API, etc.)
    // setProducts(fetchedProducts);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
