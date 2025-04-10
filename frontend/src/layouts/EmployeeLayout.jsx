import { Routes, Route } from 'react-router-dom';
import EmployeeHome from '../employee/EmployeeHome';
import EmployeeChat from '../employee/Chat';
import EmployeeProfile from '../employee/profile';
import Slots from '../employee/slots';

function EmployeeLayout() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeHome />} />
      <Route path="/chat" element={<EmployeeChat />} />
      <Route path="/profile" element={<EmployeeProfile />} />
      <Route path="/slots" element={<Slots />} />
    </Routes>
  );
}

export default EmployeeLayout; 