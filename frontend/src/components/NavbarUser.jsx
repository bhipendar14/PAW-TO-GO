import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import "./NavbarUser.css"; // Import the Navbar styles

const Navbar = () => {
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState({
    name: "U",
    image: "",
  });

  useEffect(() => {
    // Check if user data exists in localStorage, if not create a default user
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        // Create a temporary user for chat testing
        const defaultUser = {
          id: 'default_' + Math.random().toString(36).substring(2, 9),
          name: 'Guest User',
          role: 'user',
        };
        localStorage.setItem('user', JSON.stringify(defaultUser));
        setUserData(defaultUser);
      } else {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || parsedUser.username || 'U',
          image: parsedUser.image || '',
        });
      }
    } catch (error) {
      console.error('Error handling user data:', error);
    }
  }, []);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  return (
    <>
      <nav className="navbar">
        <div className="logo">PAW TO GO</div>
        <ul className="nav-links">
          <li><Link to="/homeusers">Home</Link></li>
          <li><Link to="/customer/product">Product</Link></li>
          <li><Link to="/medicaltips">Medical Tips</Link></li>
          <li><Link to="/slots">Slot Booking</Link></li>
          <li><Link to="/servicescustomers">Services</Link></li>
          <li><Link to="/aboutcustomers">About</Link></li>
          <li><Link to="/contactcustomers">Contact</Link></li>
          <li><Link to="#" onClick={() => setShowChat(!showChat)}>Chat</Link></li>
        </ul>
        <div className="profile-container">
          <Link to="/customer/profile" className="profile-icon">
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

export default Navbar;
