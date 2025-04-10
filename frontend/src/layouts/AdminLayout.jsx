import { Routes, Route } from 'react-router-dom';
import AdminHome from '../admin/home';
import AdminProfile from '../admin/Profile';
import AdminEmployee from '../admin/Employee';
import AdminCustomer from '../admin/Customer';

function AdminLayout() {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/profile" element={<AdminProfile />} />
      <Route path="/employee" element={<AdminEmployee />} />
      <Route path="/customer" element={<AdminCustomer />} />
    </Routes>
  );
}

export default AdminLayout; 