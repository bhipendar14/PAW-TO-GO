import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext"; // Import ThemeContext

// Import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./customer/Login"; 
import Register from "./customer/Register"; 
import Product from "./pages/product";
import CustomerHome from "./Customer.pages/CustomerHome";
import MedicalTips from "./Customer.pages/MedicalTips";
import SlotBooking from "./Customer.pages/SlotBooking";
import ServicesCustomers from "./Customer.pages/ServicesCustomers";
import ContactCustomer from "./Customer.pages/ContactCustomer";
import AboutCustomer from "./Customer.pages/AboutCustomer";
import CustomerProfile from "./Customer.pages/CustomerProfile";
import CustomerChat from "./Customer.pages/Chat";
import CustomerProduct from "./Customer.pages/CustomerProduct";
import CustomerCart from "./Customer.pages/cart";

import EmployeeHome from "./employee/EmployeeHome";
import EmployeeChat from "./employee/Chat";
import EmployeeProfile from "./employee/profile";
import Slots from "./employee/slots"; 


import AdminHome from "./admin/Home";
import AdminProfile from "./admin/Profile";
import AdminEmployee from "./admin/Employee";
import AdminCustomer from "./admin/Customer";


const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    } else {
      console.error("❌ No userId found in localStorage");
    }
  }, []);

  return (
    <ThemeProvider> {/* Apply theme globally */}
      <ChatProvider>
        <ToastContainer theme="colored" /> {/* Ensure Toast adapts to theme */}
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
          <Route path="/homeusers" element={<CustomerHome />} />
          <Route path="/servicescustomers" element={<ServicesCustomers />} />
          <Route path="/contactcustomers" element={<ContactCustomer />} />
          <Route path="/aboutcustomers" element={<AboutCustomer />} />
          <Route path="/slots" element={<SlotBooking />} />
          <Route path="/medicaltips" element={<MedicalTips />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/product" element={<CustomerProduct />} />
          <Route path="/customer/orders" element={<CustomerCart />} />
          <Route path="/customer/chat" element={<CustomerChat userId={userId} />} />

          {/* Employee Routes */}
          <Route path="/employee/home" element={<EmployeeHome />} />
          <Route path="/employee/chat" element={<EmployeeChat userId={userId} />} />
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
  );
};

export default App;
