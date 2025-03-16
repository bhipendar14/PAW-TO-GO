import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt, FaCheckCircle } from "react-icons/fa";  // Trash bin and check circle icons
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

  // Cancel a slot (updates status instead of deleting)
  const handleCancel = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/slots/cancel/${id}`);
      if (res.status === 200) {
        toast.warning("Slot cancelled!");
        
        // Remove the canceled slot from the list (by filtering it out)
        setSlots(slots.filter((slot) => slot._id !== id));
      }
    } catch (error) {
      toast.error("Failed to cancel slot");
    }
  };

const handleConfirm = async (id) => {
    try {
        const res = await axios.put(`http://localhost:5001/api/slots/confirm/${id}`);
        if (res.status === 200) {
            toast.success("Slot confirmed!");

            // Update the status of the confirmed slot
            setSlots(slots.map((slot) => slot._id === id ? { ...slot, status: "confirmed" } : slot));
        }
    } catch (error) {
        toast.error("Failed to confirm slot");
        console.error("Confirmation error:", error);
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
              slot.status !== "canceled" && ( // Only show slots that are not canceled
                <li key={slot._id} className="slot-card">
                  <p><strong>User:</strong> {slot.userName}</p>
                  <p><strong>Email:</strong> {slot.userEmail}</p>
                  <p><strong>Address:</strong> {slot.userAddress}</p>
                  <p><strong>Scheduled Time:</strong> {slot.schedule}</p>
                  <p><strong>Status:</strong> {slot.status}</p>
                  <div className="slot-actions">
                    {/* Confirm Button */}
                    {slot.status !== "confirmed" && (
                      <button 
                        onClick={() => handleConfirm(slot._id)} 
                        className="confirm-btn"
                      >
                        <FaCheckCircle /> Confirm
                      </button>
                    )}
                    {/* Cancel Button */}
                    <button 
                      onClick={() => handleCancel(slot._id)} 
                      className="cancel-btn"
                    >
                      <FaTrashAlt /> {/* Trash bin icon */}
                    </button>
                  </div>
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Slots;
