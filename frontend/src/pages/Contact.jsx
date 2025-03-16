import { useState } from "react";
import Navbar from "../components/Navbar";
import "../pages/Contact.css";

const ContactCustomer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:bhipendarkumar31@gmail.com ?subject=Contact Inquiry from ${name}&body=Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    window.location.href = mailtoLink;
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
        <p>Our Team Members will be in toch with you.<br/> All the team members are Miss Sheetal ,Miss Shreemanta, Mr Bhipendar Kumar</p>
        </div>

        <form className="contact-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default ContactCustomer;
