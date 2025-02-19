import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./slot.css";
import Navbar from "../employee/EmployeeNavbar";

const Slots = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/slots/bookings");
      setSlots(response.data);
    } catch (error) {
      toast.error("Error fetching slots");
    }
  };

  // ✅ Cancel a slot (updates status instead of deleting)
  const handleCancel = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/slots/cancel/${id}`);
      if (res.status === 200) {
        toast.warning("Slot cancelled!");
        fetchSlots(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to cancel slot");
    }
  };

  return (
    <>
    <Navbar />
    <div className="employee-slots-container">
      <h2>Booked Slots</h2>
      {slots.length === 0 ? (
        <p>No bookings available</p>
      ) : (
        <ul>
          {slots.map((slot) => (
            <li key={slot._id} className="slot-card">
              <p><strong>User:</strong> {slot.userName}</p>
              <p><strong>Email:</strong> {slot.userEmail}</p>
              <p><strong>Address:</strong> {slot.userAddress}</p>
              <p><strong>Scheduled Time:</strong> {slot.schedule}</p>
              <p><strong>Status:</strong> {slot.status}</p>
              <button onClick={() => handleCancel(slot._id)} className="cancel-btn">
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
};

export default Slots;
