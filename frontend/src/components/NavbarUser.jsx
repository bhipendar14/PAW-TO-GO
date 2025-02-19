import { Link } from "react-router-dom";
import { useState } from "react";
import "./NavbarUser.css"; // Import the Navbar styles

const Navbar = () => {
  const user = {
    name: "U", // Replace with actual user data from state/context
    image: "", // Replace with user profile image URL if available
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  return (
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

      </ul>
      <div className="profile-container">
        <Link to="/customer/profile" className="profile-icon">
          {user.image ? (
            <img src={user.image} alt="User" className="profile-image" />
          ) : (
            <span className="profile-initial">{getInitial(user.name)}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
