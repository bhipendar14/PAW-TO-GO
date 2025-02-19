import Navbar from "../components/NavbarUser";
import "../pages/Services.css";

const ServicesCustomers = () => {
  return (
    <div>
      <Navbar />
      <section className="services-hero">
        <h1>Our Pet Care Services</h1>
        <p>Providing the best care and training for your beloved pets 24/7.</p>
      </section>

      <section className="services-container">
        <div className="service-card">
          <img src="https://img.freepik.com/free-photo/veterinarian-examining-dog_23-2148890227.jpg" alt="Pet Health Checkups" />
          <h3>Pet Health Checkups</h3>
          <p>Comprehensive health checkups to keep your pet fit and healthy.</p>
        </div>

        <div className="service-card">
          <img src="https://img.freepik.com/free-photo/dog-training-outdoors_1150-10637.jpg" alt="Pet Training" />
          <h3>Pet Training</h3>
          <p>Professional trainers to help your pets learn good behavior.</p>
        </div>

        <div className="service-card">
          <img src="https://img.freepik.com/free-photo/closeup-adorable-cat-looking-camera_181624-35838.jpg" alt="Emergency Pet Care" />
          <h3>Emergency Pet Care</h3>
          <p>24/7 emergency care to ensure your pet's safety at all times.</p>
        </div>
      </section>
    </div>
  );
};

export default ServicesCustomers;
