import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";  // Added info circle icon
import "./slot.css";
import Navbar from "../employee/EmployeeNavbar";

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [hospitalAddress, setHospitalAddress] = useState({
    name: "PAW TO GO Pet Care Center",
    address: "123 Pet Care Avenue, Pet City",
    phone: "+1 (555) 123-4567",
    email: "appointments@pawtogo.com",
    hours: "Mon-Sat: 8:00 AM - 7:00 PM, Sun: 10:00 AM - 4:00 PM"
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/slots/bookings");
      setSlots(response.data);
    } catch (fetchError) {
      toast.error("Error fetching slots");
      console.error("Error fetching slots:", fetchError);
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
    } catch (cancelError) {
      toast.error("Failed to cancel slot");
      console.error("Cancellation error:", cancelError);
    }
  };

  // Open address modal before confirming
  const openConfirmModal = (id) => {
    setSelectedSlotId(id);
    setShowAddressModal(true);
  };

  // Confirm a slot with hospital address information
  const handleConfirm = async () => {
    try {
      if (!selectedSlotId) return;
      
      const res = await axios.put(`http://localhost:5001/api/slots/confirm/${selectedSlotId}`, {
        hospitalInfo: hospitalAddress
      });
      
      if (res.status === 200) {
        toast.success("Slot confirmed and notification sent to user!");
        setShowAddressModal(false);
        
        // Update the status of the confirmed slot
        setSlots(slots.map((slot) => 
          slot._id === selectedSlotId ? { ...slot, status: "confirmed" } : slot
        ));
        
        // Reset selected slot
        setSelectedSlotId(null);
      }
    } catch (confirmError) {
      toast.error("Failed to confirm slot");
      console.error("Confirmation error:", confirmError);
      setShowAddressModal(false);
    }
  };

  // Handle address form changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setHospitalAddress(prev => ({
      ...prev,
      [name]: value
    }));
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
                  <p><strong>Status:</strong> <span className={`status-badge ${slot.status}`}>{slot.status}</span></p>
                  <div className="slot-actions">
                    {/* Confirm Button */}
                    {slot.status !== "confirmed" && (
                      <button 
                        onClick={() => openConfirmModal(slot._id)} 
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
                      <FaTrashAlt /> Cancel
                    </button>
                  </div>
                </li>
              )
            ))}
          </ul>
        )}
        
        {/* Hospital Address Modal */}
        {showAddressModal && (
          <div className="modal-overlay">
            <div className="address-modal">
              <h3><FaInfoCircle /> Confirm Appointment</h3>
              <p>Please verify the hospital information that will be sent to the customer:</p>
              
              <div className="form-group">
                <label>Hospital Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={hospitalAddress.name} 
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="form-group">
                <label>Address:</label>
                <input 
                  type="text" 
                  name="address" 
                  value={hospitalAddress.address} 
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="form-group">
                <label>Phone:</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={hospitalAddress.phone} 
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="text" 
                  name="email" 
                  value={hospitalAddress.email} 
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="form-group">
                <label>Business Hours:</label>
                <input 
                  type="text" 
                  name="hours" 
                  value={hospitalAddress.hours} 
                  onChange={handleAddressChange}
                />
              </div>
              
              <div className="modal-buttons">
                <button onClick={() => setShowAddressModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="confirm-btn">
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Slots;
