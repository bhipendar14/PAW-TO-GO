import { useTheme } from "../context/ThemeContext";
import AdminNavbar from "./AdminNavbar";

const Home = () => {
  
  const { theme, changeTheme } = useTheme();
  const themes = ["white", "pink", "lightblue", "lightblue", "lightgreen", "lightyellow", "brown", "red", "gray", "silver", "gold","violet",];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <AdminNavbar />
      <h1>Admin Dashboard</h1>
      <div style={{ marginTop: "20px", padding: "10px", borderRadius: "8px", background: "#f1f1f1" }}>
        <label>Change Theme:</label>
        <select onChange={(e) => changeTheme(e.target.value)} value={theme} style={{ padding: "5px" }}>
          {themes.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Home;
