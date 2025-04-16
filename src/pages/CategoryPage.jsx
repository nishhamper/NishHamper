import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import ProductCard from "../components/ProductCard";

// Helper function to format category name for query
const formatCategoryName = (name) => {
  if (name === "couples") return "Soulmates Gifts"; // Match category names to their real values
  if (name === "celebrations") return "Celebrations Gifts";
  if (name === "heroes") return "Everyday Heroes Gifts";
  return name;
};

const CategoryPage = () => {
  const { categoryName } = useParams(); // category from URL params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const formattedCategory = formatCategoryName(categoryName); // Apply category name formatting
        console.log("Fetching products for category:", formattedCategory);  // Check formatted category
        
        // Create query to fetch products for the formatted category
        const q = query(
          collection(db, "products"),
          where("category", "==", formattedCategory)  // Query Firestore for matching category
        );
        
        // Execute query and fetch documents
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Set the fetched products into the state
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    fetchProducts();
  }, [categoryName]); // Dependency on categoryName, so it runs whenever category changes

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 text-center text-primary">
        {formatCategoryName(categoryName)}  {/* Display formatted category */}
      </h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : products.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
