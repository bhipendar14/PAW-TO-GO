import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeNavbar from "./EmployeeNavbar";
import "./EmployeeHome.css";

const BACKEND_URL = "http://localhost:5001";

const EmployeeHome = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingPickups: 0,
    completedToday: 0,
    upcomingAppointments: 0,
    totalPets: 0
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is an employee
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser || storedUser.role !== "employee") {
      navigate("/login");
      return;
    }

    // Fetch slots data
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/slots/bookings`);
        
        // Set the slots data
        setSlots(response.data || []);
        
        // Calculate stats based on slots data
        const pendingCount = response.data.filter(slot => slot.status === "pending").length;
        const confirmedCount = response.data.filter(slot => slot.status === "confirmed").length;
        const totalCount = response.data.length;
        
        // Get today's date for completed today calculation
        const today = new Date().toISOString().split('T')[0];
        const completedToday = response.data.filter(slot => 
          slot.status === "confirmed" && 
          new Date(slot.schedule).toISOString().split('T')[0] === today
        ).length;
        
        setStats({
          pendingPickups: pendingCount,
          completedToday: completedToday,
          upcomingAppointments: confirmedCount,
          totalPets: totalCount
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching slots data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle navigation to different sections
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle slot confirmation
  const handleConfirm = async (id) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/slots/confirm/${id}`);
      if (res.status === 200) {
        // Update the status of the confirmed slot
        setSlots(slots.map((slot) => 
          slot._id === id ? { ...slot, status: "confirmed" } : slot
        ));
      }
    } catch (error) {
      console.error("Confirmation error:", error);
    }
  };

  // Handle slot cancellation
  const handleCancel = async (id) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/slots/cancel/${id}`);
      if (res.status === 200) {
        // Update the slots list by filtering out the canceled slot
        setSlots(slots.filter((slot) => slot._id !== id));
      }
    } catch (error) {
      console.error("Cancellation error:", error);
    }
  };

  return (
    <div className={`employee-dashboard ${theme === "black" ? "dark-theme" : "light-theme"}`}>
      <EmployeeNavbar />
      
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Employee Dashboard</h1>
          <p>Welcome back, {user?.name || "Pet Care Professional"}!</p>
          <p className="date">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <section className="stats-container">
              <div className="stat-card">
                <i className="fas fa-clock"></i>
                <h3>Pending Pickups</h3>
                <p className="stat-number">{stats.pendingPickups}</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-check-circle"></i>
                <h3>Completed Today</h3>
                <p className="stat-number">{stats.completedToday}</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-calendar"></i>
                <h3>Upcoming</h3>
                <p className="stat-number">{stats.upcomingAppointments}</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-paw"></i>
                <h3>Total Slots</h3>
                <p className="stat-number">{stats.totalPets}</p>
              </div>
            </section>

            <section className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button onClick={() => handleNavigation("/employee/slots")}>
                  <i className="fas fa-calendar-plus"></i>
                  Manage Schedule
                </button>

                <button onClick={() => handleNavigation("/employee/profile")}>
                  <i className="fas fa-user-circle"></i>
                  Profile
                </button>
              </div>
            </section>

            <section className="recent-pickups">
              <h2>Scheduled Bookings</h2>
              <div className="table-container">
                {slots.length === 0 ? (
                  <p className="no-data">No bookings available</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Schedule</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map(slot => (
                        <tr key={slot._id} className={`status-${slot.status}`}>
                          <td>{slot.userName}</td>
                          <td>{slot.userEmail}</td>
                          <td>{slot.userAddress}</td>
                          <td>{new Date(slot.schedule).toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${slot.status}`}>
                              {slot.status}
                            </span>
                          </td>
                          <td className="action-buttons-cell">
                            {slot.status !== "confirmed" && (
                              <button 
                                onClick={() => handleConfirm(slot._id)} 
                                className="confirm-btn"
                              >
                                <i className="fas fa-check-circle"></i>
                              </button>
                            )}
                            <button 
                              onClick={() => handleCancel(slot._id)} 
                              className="cancel-btn"
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeHome;
