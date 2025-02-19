import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";
import Navbar from "../components/Navbar";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


const Product = () => {
  const navigate = useNavigate();

  const allProducts = [
    { id: 1, name: "Dog Food", price: 500, rating: 5, category: "Food", discount: 10, image: "https://m.media-amazon.com/images/I/71H+0wzNALL._SX679_.jpg", details: "High-protein food for dogs." },
    { id: 2, name: "Cat Toy", price: 300, rating: 4, category: "Toys", discount: 5, image: "https://m.media-amazon.com/images/I/31HxrtDG4lL._SX300_SY300_QL70_FMwebp_.jpg", details: "Fun toy for cats." },
    { id: 3, name: "Bird Cage", price: 1200, rating: 4, category: "Accessories", discount: 15, image: "https://m.media-amazon.com/images/I/51vA4chXKVL._SX300_SY300_QL70_FMwebp_.jpg", details: "Spacious cage for birds." },
    { id: 4, name: "Fish Tank", price: 2000, rating: 5, category: "Accessories", discount: 20, image: "https://m.media-amazon.com/images/I/610j3RNhwgL._SX679_.jpg", details: "Large aquarium for fish." },
    { id: 5, name: "Pet Shampoo", price: 250, rating: 3, category: "Care", discount: 8, image: "https://m.media-amazon.com/images/I/51nOiUiNb9L._SX679_.jpg", details: "Gentle shampoo for pets." },
    {
      id: 6,
      name: "Royal Canin Dog Food",
      price: 1200,
      rating: 4,
      discount: "10% OFF",
      image: "https://m.media-amazon.com/images/I/61cM0Gi2ynL._SL1500_.jpg",
      details: "Premium dog food with essential nutrients.",
    },
    {
      id: 7,
      name: "Whiskas Cat Food",
      price: 800,
      rating: 5,
      discount: "15% OFF",
      image: "https://m.media-amazon.com/images/I/71s9encjhcL._SL1500_.jpg",
      details: "Delicious and healthy food for your cat.",
    },
    {
      id: 8,
      name: "Pedigree Puppy Food",
      price: 900,
      rating: 4,
      discount: "12% OFF",
      image: "https://m.media-amazon.com/images/I/41v2TU+Fe3L._SY300_SX300_.jpg",
      details: "Specially formulated for growing puppies.",
    },
    {
      id: 9,
      name: "Pet Shampoo - Anti Flea",
      price: 500,
      rating: 4,
      discount: "5% OFF",
      image: "https://m.media-amazon.com/images/I/411W9E6CdBL._SX300_SY300_QL70_FMwebp_.jpg",
      details: "Cleanses and protects against fleas & ticks.",
    },
    {
      id: 10,
      name: "Chew Toy - Rubber Bone",
      price: 300,rating: 3.5,
      discount: "20% OFF",
      image: "https://m.media-amazon.com/images/I/51n-swFJ67L.jpg",
      details: "Durable rubber chew toy for dogs.",
    },
    {
      id: 11,
      name: "Cat Scratching Post",
      price: 1100,
      rating: 4.5,
      discount: "18% OFF",
      image: "https://m.media-amazon.com/images/I/51XahZu8k9L._SX300_SY300_QL70_FMwebp_.jpg",
      details: "Perfect for keeping your cat entertained.",
    },
    {
      id: 12,
      name: "Soft Pet Bed - Large",
      price: 2500,
      rating: 3,
      discount: "25% OFF",
      image: "https://m.media-amazon.com/images/I/31j5O6zosjL._SX300_SY300_QL70_FMwebp_.jpg",
      details: "Comfortable and cozy bed for all pets.",
    },
    {
      id: 13,
      name: "Adjustable Pet Harness",
      price: 700,
      rating: 2.5,
      discount: "10% OFF",
      image: "https://m.media-amazon.com/images/I/61W01J4U4aL._SX679_.jpg",
      details: "Safe and secure harness for walks.",
    },
    {
      id: 14,
      name: "Pet Water Dispenser",
      price: 1500,
      discount: "30% OFF",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/41V4nGPRf2S._SY300_SX300_QL70_FMwebp_.jpg",
      details: "Automatic water dispenser for pets.",
    },
    {
      id: 15,
      name: "Organic Pet Treats",
      price: 650,
      rating: 4,
      discount: "8% OFF",
      image: "https://m.media-amazon.com/images/I/41bapiRnvQL._SX300_SY300_QL70_FMwebp_.jpg",
      details: "Healthy and organic treats for pets.",
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [filters, setFilters] = useState({ price: 5000, rating: 0, category: "All" });
  const [adIndex, setAdIndex] = useState(0);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#FFD700" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      } else {
        stars.push(<FaRegStar key={i} color="#FFD700" />);
      }
    }
    return stars;
  };
  

  // Update Advertisement every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % allProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filtered = allProducts.filter((product) => product.price <= filters.price);
    if (filters.rating) filtered = filtered.filter((product) => product.rating >= filters.rating);
    if (filters.category !== "All") filtered = filtered.filter((product) => product.category === filters.category);
    setFilteredProducts(filtered);
  };

  return (
    <>
    <Navbar/>
    <div className="product-page">
      {/* Advertisement Section */}
      <div className="ad-container" onClick={() => navigate("/login")}>
        <img src={allProducts[adIndex].image} alt={allProducts[adIndex].name} />
        <div className="ad-details">
          <p>{allProducts[adIndex].name}</p>
          
          <span>{allProducts[adIndex].discount}% Off</span>
        </div>
      </div>

      {/* Main Section */}
      <div className="main-container">
        {/* Filter Box */}
        <div className="filter-box">
          <h3>Filters</h3>
          <label>Price Range: ₹{filters.price}</label>
          <input type="range" min="100" max="5000" value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })} />

          <label>Rating:</label>
          <select onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}>
            <option value="0">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          <label>Category:</label>
          <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Toys">Toys</option>
            <option value="Accessories">Accessories</option>
            <option value="Care">Care</option>
          </select>

          <button onClick={applyFilters}>Apply Filters</button>
        </div>

        {/* Products Section */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h4>{product.name}</h4>
                <p className="price">₹{product.price} <span>- {product.discount}% Off</span></p>
                <p className="rating">{renderStars(product.rating)}</p>
                <p className="details">{product.details}</p>
                <button onClick={() => navigate("/login")}>Add to Cart</button>
              </div>
            ))
          ) : (
            <p className="no-products">No products match your filters.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Product;
