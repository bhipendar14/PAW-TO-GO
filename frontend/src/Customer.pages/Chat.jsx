import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./cart.css";
import Navbar from "../components/NavbarUser";

<<<<<<< HEAD
const socket = io("https://paw-to-go.onrender.com"); // Replace with your backend URL

const CustomerChat = ({ userId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const chatMessagesRef = useRef(null);
=======
const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    pin: "",
    city: "",
    house: "",
    landmark: "",
    state: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
>>>>>>> 41dc925b777f56db032b06085f73c8fe29c881c6

  // Fetch addresses on component mount (mock data for now)
  useEffect(() => {
<<<<<<< HEAD
    // Fetch employees from backend
    axios.get("https://paw-to-go.onrender.com/api/employees").then((response) => {
      setEmployees(response.data);
    });

    // Listen for incoming messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      if (newMessage.senderId !== userId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: true,
        }));
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat window
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
=======
    const savedAddresses = []; // Fetch from API or localStorage later
    setAddresses(savedAddresses);
    if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]);
>>>>>>> 41dc925b777f56db032b06085f73c8fe29c881c6
    }
  }, []);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    if (addresses.length === 0) {
      alert("Please add a delivery address before proceeding.");
      return;
    }
    setShowPaymentOptions(true);
  };

  const handlePlaceOrder = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

<<<<<<< HEAD
    try {
      const response = await axios.get(`https://paw-to-go.onrender.com/api/chat/${chatRoomId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
=======
  const confirmPayment = () => {
    alert("Order placed successfully!");
    navigate("/homeusers");
  };

  const handleRemoveProduct = () => {
    setProduct(null);
    navigate("/homeusers");
  };

  const validateAddress = () => {
    let newErrors = {};
    if (!newAddress.name.trim()) newErrors.name = "Name is required";
    if (!newAddress.pin.trim() || !/^\d{6}$/.test(newAddress.pin))
      newErrors.pin = "Enter a valid 6-digit Pin Code";
    if (!newAddress.city.trim()) newErrors.city = "City is required";
    if (!newAddress.house.trim()) newErrors.house = "House number is required";
    if (!newAddress.landmark.trim())
      newErrors.landmark = "Landmark is required";
    if (!newAddress.state.trim()) newErrors.state = "State is required";
    if (!newAddress.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    if (validateAddress()) {
      setAddresses([...addresses, newAddress]);
      setSelectedAddress(newAddress); // Select newly added address
      setShowAddAddressForm(false);
      setNewAddress({
        name: "",
        pin: "",
        city: "",
        house: "",
        landmark: "",
        state: "",
        country: "",
      });
      setErrors({});
>>>>>>> 41dc925b777f56db032b06085f73c8fe29c881c6
    }
  };

  if (!product) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="empty-cart">
          <h2>No product selected.</h2>
          <p>Please go back and add a product to the cart.</p>
          <button onClick={() => navigate("/customer/product")}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        {/* Left Side: Product Details */}
        <div className="product-details">
          <img src={product?.image} alt={product?.name || "Product"} />
          <h2>{product?.name}</h2>
          <p className="price">
            ₹{product?.price} <span>- {product?.discount}% Off</span>
          </p>
          <p className="details">{product?.details}</p>
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
          <button
            className="shop-more-btn"
            onClick={() => navigate("/customer/product")}
          >
            Shop More
          </button>
        </div>

        {/* Right Side: Address and Payment Options */}
        <div className="right-side">
          <div className="address-box">
            <h3>Delivery Address</h3>
            {addresses.length > 0 ? (
              <select
                value={JSON.stringify(selectedAddress)}
                onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}
              >
                {addresses.map((addr, index) => (
                  <option key={index} value={JSON.stringify(addr)}>
                    {addr.name}, {addr.city}, {addr.house}, {addr.landmark},{" "}
                    {addr.state}, {addr.pin}, {addr.country}
                  </option>
                ))}
              </select>
            ) : (
              <p>No saved addresses. Add a new one.</p>
            )}
            <button
              className="add-address-btn"
              onClick={() => setShowAddAddressForm(!showAddAddressForm)}
            >
              {showAddAddressForm ? "Cancel" : "Add New Address"}
            </button>

            {showAddAddressForm && (
              <div className="new-address-form">
                {Object.keys(newAddress).map((field) => (
                  <div key={field}>
                    <input
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={newAddress[field]}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, [field]: e.target.value })
                      }
                    />
                    {errors[field] && <span className="error">{errors[field]}</span>}
                  </div>
                ))}
                <button className="save-address-btn" onClick={handleAddAddress}>
                  Save Address
                </button>
              </div>
            )}
          </div>

          {showPaymentOptions && (
            <div className="payment-box">
              <h3>Order Summary</h3>
              <p>
                {product?.name} (x{quantity})
              </p>
              <p>
                Total: ₹
                {(product?.price * quantity * (1 - product?.discount / 100)).toFixed(2)}
              </p>
              {["UPI/QR", "Credit/ATM Card", "Cash on Delivery"].map((method) => (
                <button key={method} className="place-order-btn" onClick={() => handlePlaceOrder(method)}>
                  {method}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPaymentMethod && (
        <div className="payment-modal">
          <div className="payment-content">
            <h3>{selectedPaymentMethod} Payment</h3>
            {selectedPaymentMethod === "UPI/QR" && <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=kumarbhipendar2@oksbi" alt="QR Code" />}
            {selectedPaymentMethod === "Cash on Delivery" && <p>Pay in cash when the product is delivered.</p>}
            <button className="confirm-payment-btn" onClick={confirmPayment}>Confirm Payment</button>
            <button className="close-payment-btn" onClick={() => setSelectedPaymentMethod(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
