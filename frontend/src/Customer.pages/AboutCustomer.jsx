import Navbar from "../components/NavbarUser";
import "../pages/About.css";

const AboutCustomer  = () => {
  return (
    <div>
      <Navbar />
      <section className="about-section">
        <h1>About Us</h1>
        <p>Providing 24/7 pet healthcare and professional training services.</p>
      </section>

      <section className="about-container">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            We are a passionate team of veterinarians and trainers dedicated to ensuring the well-being of pets. Our mission is to provide top-notch medical care, expert training, and emergency support for your furry companions.
          </p>
        </div>
        <img src="https://img.freepik.com/free-photo/woman-training-dog-outdoors_1150-10639.jpg" alt="About Us" />
      </section>
    </div>
  );
};

export default AboutCustomer;
