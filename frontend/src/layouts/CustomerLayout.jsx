import { Routes, Route } from 'react-router-dom';
import CustomerHome from '../Customer.pages/CustomerHome';
import MedicalTips from '../Customer.pages/MedicalTips';
import SlotBooking from '../Customer.pages/SlotBooking';
import ServicesCustomers from '../Customer.pages/ServicesCustomers';
import ContactCustomer from '../Customer.pages/ContactCustomer';
import AboutCustomer from '../Customer.pages/AboutCustomer';
import CustomerProfile from '../Customer.pages/CustomerProfile';
import CustomerChat from '../Customer.pages/Chat';
import CustomerProduct from '../Customer.pages/CustomerProduct';
import CustomerCart from '../Customer.pages/cart';

function CustomerLayout() {
  return (
    <Routes>
      <Route path="/" element={<CustomerHome />} />
      <Route path="/services" element={<ServicesCustomers />} />
      <Route path="/contact" element={<ContactCustomer />} />
      <Route path="/about" element={<AboutCustomer />} />
      <Route path="/slots" element={<SlotBooking />} />
      <Route path="/medical-tips" element={<MedicalTips />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/product" element={<CustomerProduct />} />
      <Route path="/orders" element={<CustomerCart />} />
      <Route path="/chat" element={<CustomerChat />} />
    </Routes>
  );
}

export default CustomerLayout; 