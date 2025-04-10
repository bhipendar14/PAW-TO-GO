import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import ChatBox from "../components/ChatBox";
import "../admin/AdminNavbar.css";

const EmployeeNavbar = () => {
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    image: "",
  });
  
  useEffect(() => {
    // Check if employee user data exists in localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        // Create a temporary employee user for testing
        const defaultEmployee = {
          id: 'emp_' + Math.random().toString(36).substring(2, 9),
          name: 'Employee User',
          role: 'employee',
        };
        localStorage.setItem('user', JSON.stringify(defaultEmployee));
        setUserData(defaultEmployee);
      } else {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || 'E',
          image: parsedUser.image || '',
        });
      }
    } catch (error) {
      console.error('Error handling employee data:', error);
    }
  }, []);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "E");

  return (
    <>
      <nav className="navbar" style={{ backgroundColor: theme, transition: "0.3s ease-in-out" }}>
        <div className="logo" style={{ color: theme === "black" ? "white" : "black" }}>PAW TO GO</div>
        
        <ul className="nav-links">
          <li><Link to="/employee/home" style={{ color: theme === "black" ? "white" : "black" }}>Home</Link></li>
          <li><Link to="/employee/slots" style={{ color: theme === "black" ? "white" : "black" }}>Schedule</Link></li>
          <li><Link to="#" onClick={() => setShowChat(!showChat)} style={{ color: theme === "black" ? "white" : "black" }}>Chat</Link></li>
        </ul>
        
        <div className="profile-container">
          <Link to="/employee/profile" className="profile-icon">
            {userData.image ? (
              <img src={userData.image} alt="User" className="profile-image" />
            ) : (
              <span className="profile-initial">{getInitial(userData.name)}</span>
            )}
          </Link>
        </div>
      </nav>
      {showChat && <ChatBox onClose={() => setShowChat(false)} />}
    </>
  );
};

export default EmployeeNavbar;
