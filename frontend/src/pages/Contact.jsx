import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div>
      <Navbar />
      <section className="contact-section">
        <h1>Contact Us</h1>
        <p>Reach out to us for any pet care inquiries.</p>
      </section>

      <section className="contact-container">
        <div className="contact-details">
          <h2>Get In Touch</h2>
          <p>Email: bhipendarkumar31@gmail.com</p>
          <p>Phone: +91 8091220123</p>
          <p>Address: Marwadi, Rajkot, Gujrat</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
