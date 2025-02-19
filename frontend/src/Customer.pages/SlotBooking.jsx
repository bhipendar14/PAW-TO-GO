import { useState, useEffect } from "react";
import "./SlotBooking.css";
import Navbar from "../components/NavbarUser";

const SlotBooking = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [message, setMessage] = useState(null);

    // ✅ Show notification and auto-hide after 3 seconds
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // ✅ Book Slot
    const bookSlot = async () => {
        if (!date || !time) {
            showMessage("Please select a date and time!", "error");
            return;
        }

        try {
            const res = await fetch("http://localhost:5001/api/slots/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id, 
                    schedule: `${date} at ${time}`
                })
            });

            const data = await res.json();
            if (res.ok) {
                setSelectedSlot({ date, time });
                showMessage("Slot booked successfully!", "success");
            } else {
                showMessage(data.error, "error");
            }
        } catch (error) {
            console.error("Booking error:", error);
            showMessage("Failed to book slot!", "error");
        }
    };

    // ✅ Cancel Slot
    const cancelSlot = () => {
        setSelectedSlot(null);
        showMessage("Slot booking canceled", "error");
    };

    // ✅ Change Slot
    const changeSlot = () => {
        setSelectedSlot(null);
        showMessage("Slot changed successfully! Please book again.", "success");
    };

    return (
      <>
        <Navbar />
        <div className="slot-booking-container">
            {/* ✅ Notification Message Box */}
            {message && <div className={`notification ${message.type}`}>{message.text}</div>}

            <h2>Book Your Slot</h2>
            <p>Welcome, {user?.name}</p>

            {!selectedSlot ? (
                <div className="slot-selection">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    <button onClick={bookSlot} className="submit-btn">Submit</button>
                </div>
            ) : (
                <div className="slot-details">
                    <h3>Booked Slot:</h3>
                    <p>Date: {selectedSlot.date}</p>
                    <p>Time: {selectedSlot.time}</p>
                    <button onClick={cancelSlot} className="cancel-btn">Cancel</button>
                    <button onClick={changeSlot} className="change-btn">Change Slot</button>
                </div>
            )}
        </div>
        <br/>

      {/* Customer Feedback Section */}
      <section className="feedback-section">
        <h2>What Our Customers Say</h2>
        <h2>Join us Today and be the Part of Us...</h2>
        <div className="feedback-container">
          <div className="feedback-card">
            <img src="https://media.istockphoto.com/id/1276788283/photo/young-woman-with-laughing-corgi-puppy-nature-background.jpg?s=612x612&w=0&k=20&c=nOiBnVA13BupVn0t7o5fCytV5ZROgNgSWkQas3IuHIw=" alt="Customer 1" />
            <h4>Teena</h4>
            <p>"Fantastic service! My dog was treated with great care. Highly recommend!"</p>
          </div>

          <div className="feedback-card">
            <img src="https://www.shutterstock.com/image-photo/handsome-bearded-man-embracing-his-600nw-2175772383.jpg" alt="Customer 2" />
            <h4>Rohan</h4>
            <p>"Best pet pickup experience ever. The staff was kind and professional."</p>
          </div>

          <div className="feedback-card">
            <img src="https://plus.unsplash.com/premium_photo-1663088810819-3fa1cc0f9894?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9nJTIwb3duZXJ8ZW58MHx8MHx8fDA%3D" alt="Customer 3" />
            <h4>Sneha</h4>
            <p>"Very reliable and safe transport for my cat. Thank you for your service!"</p>
          </div>
        </div>
      </section>
        </>
    );
};

export default SlotBooking;
