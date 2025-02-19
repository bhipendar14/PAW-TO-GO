import "./MedicalTips.css";
import Navbar from "../components/NavbarUser";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const tips = [
  {
    title: "Regular Vet Checkups",
    description:
      "Ensure your pet gets regular checkups to detect any health issues early.",
    image:
      "https://static.toiimg.com/thumb/msid-89892531,width-400,resizemode-4/89892531.jpg",
  },
  {
    title: "Healthy Diet",
    description:
      "Provide a balanced diet with necessary nutrients for your pet's well-being.",
    image:
      "https://plus.unsplash.com/premium_photo-1663045476550-6ecee3c164da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG10by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Exercise & Playtime",
    description:
      "Engage your pet in regular exercise to keep them fit and happy.",
    image:
      "https://images.unsplash.com/photo-1506242395783-cec2bda110e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG10by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const products = [
  {
    name: "Premium Dog Food",
    price: "₹1200",
    discount: "10% Off",
    image: "https://supertails.com/cdn/shop/files/Frame344684057_360x.png?v=1716445251",
    details: "Nutritious dog food for a healthy diet."
  },
  {
    name: "Cat Vitamins",
    price: "₹300",
    discount: "15% Off",
    image: "https://images-cdn.ubuy.co.in/67b451ebd54d146c0655193f-vetriscience-nucat-multivitamin-everyday.jpg",
    details: "Essential vitamins to boost your cat’s health."
  },
  {
    name: "Pet Shampoo",
    price: "₹250",
    discount: "5% Off",
    image: "https://m.media-amazon.com/images/I/413Bk0RyJ4L._SX300_SY300_QL70_FMwebp_.jpg",
    details: "Gentle shampoo for a shiny coat."
  },
  {
    name: "Dog Leash",
    price: "₹1500",
    discount: "20% Off",
    image: "https://m.media-amazon.com/images/I/51ez5oWoCSL._SX679_.jpg",
    details: "Durable leash for comfortable walks."
  },
  {
    name: "Cat Scratching Post",
    price: "₹2000",
    discount: "12% Off",
    image: "https://m.media-amazon.com/images/I/51XahZu8k9L._SX300_SY300_QL70_FMwebp_.jpg",
    details: "Perfect for your cat’s scratching needs."
  },
  {
    name: "Bird Cage",
    price: "₹800",
    discount: "10% Off",
    image: "https://m.media-amazon.com/images/I/51vA4chXKVL._SX300_SY300_QL70_FMwebp_.jpg",
    details: "Spacious cage for happy birds."
  },
  {
    name: "Fish Tank Cleaner",
    price: "₹1200",
    discount: "18% Off",
    image: "https://m.media-amazon.com/images/I/71Mfc1IVo5L._SX679_.jpg",
    details: "Keep your fish tank crystal clear."
  }
];

const MedicalTips = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToCart = () => {
    navigate("/customer/product", { state: { product: products[currentIndex] } });
  };

  return (
    <div className="medical-tips">
      <Navbar />
      <div className="medical-tips-container">
        <h1>Medical Tips for Your Pet</h1>
        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={index} className="tip-card">
              <img src={tip.image} alt={tip.title} />
              <h2>{tip.title}</h2>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
        <br/>
        <h1>Here are some products you might be interested in:</h1>
        <div className="advertisement-box" >
          
          <div className="product-card" onClick={goToCart}>
            <img src={products[currentIndex].image} alt={products[currentIndex].name} className="product-image" />
            <h2>{products[currentIndex].name}</h2>
            <p className="price">{products[currentIndex].price} <span className="discount">{products[currentIndex].discount}</span></p>
            <p className="details">{products[currentIndex].details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTips;
