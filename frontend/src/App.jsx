import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from './context/AuthContext';
import ChatBox from "./components/ChatBox";

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./customer/login"; 
import Register from "./customer/register"; 
import Product from "./pages/product";
import CustomerHome from "./Customer.pages/CustomerHome";
import MedicalTips from "./Customer.pages/MedicalTips";
import SlotBooking from "./Customer.pages/SlotBooking";
import ServicesCustomers from "./Customer.pages/ServicesCustomers";
import ContactCustomer from "./Customer.pages/ContactCustomer";
import AboutCustomer from "./Customer.pages/AboutCustomer";
import CustomerProfile from "./Customer.pages/CustomerProfile";
import CustomerProduct from "./Customer.pages/CustomerProduct";
import CustomerCart from "./Customer.pages/cart";

import EmployeeHome from "./employee/EmployeeHome";
import EmployeeProfile from "./employee/profile";
import Slots from "./employee/slots"; 

import AdminHome from "./admin/home";
import AdminProfile from "./admin/Profile";
import AdminEmployee from "./admin/Employee";
import AdminCustomer from "./admin/Customer";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
      // Show chat only for logged-in customers
      setShowChat(storedUser.role === 'user');
    } else {
      console.error("❌ No userId found in localStorage");
    }
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <ToastContainer theme="colored" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Product />} />

            {/* Customer Routes */}
            <Route path="/homeusers" element={<><CustomerHome />{showChat && <ChatBox />}</>} />
            <Route path="/servicescustomers" element={<><ServicesCustomers />{showChat && <ChatBox />}</>} />
            <Route path="/contactcustomers" element={<><ContactCustomer />{showChat && <ChatBox />}</>} />
            <Route path="/aboutcustomers" element={<><AboutCustomer />{showChat && <ChatBox />}</>} />
            <Route path="/slots" element={<><SlotBooking />{showChat && <ChatBox />}</>} />
            <Route path="/medicaltips" element={<><MedicalTips />{showChat && <ChatBox />}</>} />
            <Route path="/customer/profile" element={<><CustomerProfile />{showChat && <ChatBox />}</>} />
            <Route path="/customer/product" element={<><CustomerProduct />{showChat && <ChatBox />}</>} />
            <Route path="/customer/orders" element={<><CustomerCart />{showChat && <ChatBox />}</>} />

            {/* Employee Routes */}
            <Route path="/employee/home" element={<EmployeeHome />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/employee/slots" element={<Slots />} />

            {/* Admin Routes */}
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/employee" element={<AdminEmployee />} />
            <Route path="/admin/customer" element={<AdminCustomer />} />
            <Route path="/admin/home" element={<AdminHome />} />
          </Routes>
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
