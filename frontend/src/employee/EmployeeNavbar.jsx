import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../admin/AdminNavbar.css";

const AdminNavbar = () => {
  const { theme } = useTheme();  

 
  const user = {
    name: "",  
    image: "",  
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "E"); 

  return (
    <nav className="navbar" style={{ backgroundColor: theme, transition: "0.3s ease-in-out" }}>
      <div className="logo" style={{ color: theme === "black" ? "white" : "black" }}>PAW TO GO</div>
      
      <ul className="nav-links">
        <li><Link to="/employee/home" style={{ color: theme === "black" ? "white" : "black" }}>Home</Link></li>
        <li><Link to="/employee/chat" style={{ color: theme === "black" ? "white" : "black" }}>Chat</Link></li>
        <li><Link to="/employee/slots" style={{ color: theme === "black" ? "white" : "black" }}>Schedule</Link></li>
      </ul>
      
      <div className="profile-container">
        <Link to="/employee/profile" className="profile-icon">
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

export default AdminNavbar;
