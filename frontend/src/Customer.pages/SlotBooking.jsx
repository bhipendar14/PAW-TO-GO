import { useState, useEffect } from "react";
import "./SlotBooking.css";
import Navbar from "../components/NavbarUser";

const SlotBooking = () => {
    const user = JSON.parse(localStorage.getItem("user"));  // Get the logged-in user

    // Load saved booking details from localStorage for the specific user
    const savedBooking = JSON.parse(localStorage.getItem("savedBooking")) || {};

    const [date, setDate] = useState(savedBooking.date || "");
    const [time, setTime] = useState(savedBooking.time || "");
    const [petName, setPetName] = useState(savedBooking.petName || "");
    const [ownerName, setOwnerName] = useState(savedBooking.ownerName || "");
    const [petAge, setPetAge] = useState(savedBooking.petAge || "");
    const [phone, setPhone] = useState(savedBooking.phone || "");
    const [selectedSlot, setSelectedSlot] = useState(savedBooking.selectedSlot || null);
    const [message, setMessage] = useState(null);

    // Function to display messages
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // Function to book a slot
    const bookSlot = async () => {
        if (!date || !time || !petName || !ownerName || !phone) {
            showMessage("Please fill all required fields!", "error");
            return;
        }

        try {
            // Send a POST request to book the slot
            const res = await fetch("http://localhost:5001/api/slots/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,  // Use the logged-in user's ID
                    schedule: `${date} at ${time}`,
                    petName,
                    ownerName,
                    petAge,
                    phone
                })
            });

            const data = await res.json();
            if (res.ok) {
                const bookingDetails = { date, time, petName, ownerName, petAge, phone, selectedSlot: { date, time } };
                setSelectedSlot(bookingDetails);
                localStorage.setItem("savedBooking", JSON.stringify(bookingDetails));  // Save booking in localStorage
                showMessage("Slot booked successfully!", "success");
            } else {
                showMessage(data.error, "error");
            }
        } catch (error) {
            showMessage("Failed to book slot!", "error");
        }
    };

    // Function to cancel the booking
    const cancelSlot = () => {
        setSelectedSlot(null);
        localStorage.removeItem("savedBooking");  // Remove booking from localStorage
        showMessage("Slot booking canceled", "error");
    };

    // Function to change the slot
    const changeSlot = () => {
        setSelectedSlot(null);
        showMessage("Slot changed successfully! Please book again.", "success");
    };

    return (
        <>
            <Navbar />
            <div className="slot-booking-container">
                {message && <div className={`notification ${message.type}`}>{message.text}</div>}
                <h2>Book Your Slot</h2>
                <p>Welcome, {user?.name}</p>

                {!selectedSlot ? (
                    <div className="slot-selection">
                        <input 
                            type="text" 
                            placeholder="Pet Name" 
                            value={petName} 
                            onChange={(e) => setPetName(e.target.value)} 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Pet Owner Name" 
                            value={ownerName} 
                            onChange={(e) => setOwnerName(e.target.value)} 
                            required 
                        />
                        <input 
                            type="number" 
                            placeholder="Pet Age (Optional)" 
                            value={petAge} 
                            onChange={(e) => setPetAge(e.target.value)} 
                        />
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            min={new Date().toISOString().split('T')[0]} 
                            required 
                        />
                        <input 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            required 
                        />
                        <button onClick={bookSlot} className="submit-btn">Submit</button>
                    </div>
                ) : (
                    <div className="slot-details">
                        <h3>Booked Slot:</h3>
                        <p>Date: {selectedSlot.date}</p>
                        <p>Time: {selectedSlot.time}</p>
                        <p>Pet Name: {petName}</p>
                        <p>Owner: {ownerName}</p>
                        <p>Phone: {phone}</p>
                        <button onClick={cancelSlot} className="cancel-btn">Cancel</button>
                        <button onClick={changeSlot} className="change-btn">Change Slot</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SlotBooking;
