import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom'; // for navigation
import './HomePage.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { name: "Soulmates Gifts", imageUrl: "https://prestigehaus.com/media/magefan_blog/unique-and-elegant-engagement-gifts-for-couples.jpg" },
    { name: "Celebrations Gifts", imageUrl: "https://i.etsystatic.com/38423500/r/il/9de446/5968380196/il_1588xN.5968380196_a1h1.jpg" },
    { name: "Everyday Heroes Gifts", imageUrl: "https://i.etsystatic.com/19361583/r/il/e4e2fc/6647763096/il_1588xN.6647763096_o53c.jpg" }
  ]); // Example categories, can be fetched from Firestore if needed
  const [recentProducts, setRecentProducts] = useState([]);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
    setRecentProducts(items.slice(0, 4)); // Assuming you want to show only the first 4 as recent products
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the category page when a category card is clicked
    navigate(`/category/${category.toLowerCase().replace(/\s+/g, '')}`);
  };

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Nish Hamper</h1>
          <p className="lead mb-4">The best place for unique and thoughtful gifts. Find something special for every occasion!</p>
          <a href="#products" className="btn btn-light btn-lg">Shop Now</a>
        </div>
      </section>

      {/* Recent Products Section */}
      <section id="recent-products" className="product-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Recent Products</h2>
          <div className="row row-cols-1 row-cols-md-4 g-4 py-4">
            {recentProducts.map(product => (
              <div key={product.id} className="col">
                <ProductCard product={product} isUser={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="category-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Explore by Category</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4 py-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="col"
                onClick={() => handleCategoryClick(category.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 category-card" style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                  <img src={category.imageUrl} className="card-img-top" alt={category.name} style={{ objectFit: 'cover', height: '200px' }} />
                  <div className="card-body d-flex justify-content-center align-items-center category-text">
                    <h5 className="card-title text-white fw-bold">{category.name}</h5>
                  </div>
                  <div className="category-overlay"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section id="products" className="product-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">All Products</h2>
          <div className="row row-cols-1 row-cols-md-4 g-4 py-4">
            {products.map(product => (
              <div key={product.id} className="col">
                <ProductCard product={product} isUser={true} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
