import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the Navbar styles
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme } = useTheme(); // Get the theme from context

  return (
    <nav className="navbar" style={{ backgroundColor: theme, transition: "0.3s ease-in-out" }}>
      <div className="logo" style={{ color: theme === "black" ? "white" : "black" }}>
        PAW TO GO
      </div>
      <ul className="nav-links">
        <li><Link to="/" style={{ color: theme === "black" ? "white" : "black" }}>Home</Link></li>
        <li><Link to="/products" style={{ color: theme === "black" ? "white" : "black" }}>Product</Link></li> 
        <li><Link to="/services" style={{ color: theme === "black" ? "white" : "black" }}>Services</Link></li>
        <li><Link to="/about" style={{ color: theme === "black" ? "white" : "black" }}>About</Link></li>
        <li><Link to="/contact" style={{ color: theme === "black" ? "white" : "black" }}>Contact</Link></li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
