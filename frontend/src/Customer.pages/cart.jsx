import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./cart.css";
import Navbar from "../components/NavbarUser";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", pin: "", city: "", state: "", country: "" });

  useEffect(() => {
    // Fetch user addresses from backend (mock data for now)
    const fetchAddresses = async () => {
      const data = ["123 Main St, City, Country", "456 Elm St, Town, Country"];
      setAddresses(data);
      setAddress(data[0]);
    };
    fetchAddresses();
  }, []);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    setShowPaymentOptions(true);
  };

  const handlePlaceOrder = (paymentMethod) => {
    alert(`Order placed successfully using ${paymentMethod}`);
    navigate("/");
  };

  const handleAddAddress = () => {
    setShowAddAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.pin || !newAddress.city || !newAddress.state || !newAddress.country) {
      alert("Please fill all address fields.");
      return;
    }
    const formattedAddress = `${newAddress.name}, ${newAddress.city}, ${newAddress.state}, ${newAddress.country}, PIN: ${newAddress.pin}`;
    setAddresses((prev) => [...prev, formattedAddress]);
    setAddress(formattedAddress);
    setShowAddAddressForm(false);
    setNewAddress({ name: "", pin: "", city: "", state: "", country: "" });
  };

  const handleRemoveProduct = () => {
    setProduct(null);
    navigate("/");
  };

  if (!product) {
    return <div>No product selected. Please go back and add a product to the cart.</div>;
  }

  return (
    <>
    <Navbar />
    <div className="cart-page">
      {/* Left Side: Product Details */}
      <div className="product-details">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p className="price">
          ₹{product.price} <span>- {product.discount}% Off</span>
        </p>
        <p className="details">{product.details}</p>
        <div className="quantity-control">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
        <div className="action-buttons">
          <button className="remove-btn" onClick={handleRemoveProduct}>
            Remove
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
        <button className="shop-more-btn" onClick={() => navigate("/customer/product")}>
          Shop More
        </button>
      </div>

      {/* Right Side: Address and Payment Options */}
      <div className="right-side">
        {/* Address Section */}
        <div className="address-box">
          <h3>Delivery Address</h3>
          <select value={address} onChange={(e) => setAddress(e.target.value)}>
            {addresses.map((addr, index) => (
              <option key={index} value={addr}>
                {addr}
              </option>
            ))}
          </select>
          <button className="add-address-btn" onClick={handleAddAddress}>
            + Add New Address
          </button>

          {/* Add Address Form */}
          {showAddAddressForm && (
            <div className="add-address-form">
              <input
                type="text"
                placeholder="Name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={newAddress.pin}
                onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
              <button className="save-address-btn" onClick={handleSaveAddress}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* Payment Section */}
        {showPaymentOptions && (
          <div className="payment-box">
            <h3>Order Summary</h3>
            <p>
              {product.name} (x{quantity})
            </p>
            <p>Total: ₹{(product.price * quantity * (1 - product.discount / 100)).toFixed(2)}</p>
            <button className="place-order-btn" onClick={() => handlePlaceOrder("UPI/QR")}>
              UPI/QR
            </button>
            <button className="place-order-btn" onClick={() => handlePlaceOrder("Credit/ATM Card")}>
              Credit/ATM Card
            </button>
            <button className="place-order-btn" onClick={() => handlePlaceOrder("Cash on Delivery")}>
              Cash on Delivery
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Cart;