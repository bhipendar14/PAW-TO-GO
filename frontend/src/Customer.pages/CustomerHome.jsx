import { Link } from "react-router-dom";
import Navbar from "../components/NavbarUser";
import "../pages/Home.css"; 

const CustomerHome = () => {
  return (
    <div>
      <Navbar />
      <section className="hero">
        <div className="hero-text">
          <h1>Reliable Pet Pickup Services</h1>
          <p>Bringing your furry friends safely wherever they need to go.</p>
          <Link to="/slots">
             <button className="cta-btn">Book a Ride</button>
          </Link>
        </div>
      </section>

      {/* Separate Doctor Section */}
      <section className="doctors-section">
        <h2>Meet Our Expert Veterinarians</h2>
        <div className="doctor-container">
          <div className="doctor-card">
            <img
              src="https://img.freepik.com/premium-photo/cat-table-while-handsome-veterinarian-is-examining_85574-7701.jpg"
              alt="Dr. Bhipendar"
            />
            <h3>Dr. Bhipendar</h3>
            <p>Degree: DVM, PhD (Veterinary Science)</p>
            <p>Experience: 10+ years</p>
            <p>Contact: +123 456 7890</p>
            <p className="doctor-rating">⭐⭐⭐⭐☆ (4.5)</p>
          </div>

          <div className="doctor-card">
            <img
              src="https://img.lovepik.com/free-png/20220127/lovepik-female-pet-doctor-holding-a-cockroach-cat-png-image_401956044_wh1200.png"
              alt="Dr. Sheetal"
            />
            <h3>Dr. Sheetal</h3>
            <p>Degree: BVSc & AH</p>
            <p>Experience: 8+ years</p>
            <p>Contact: +987 654 3210</p>
            <p className="doctor-rating">⭐⭐⭐⭐☆ (4.5)</p>
          </div>

          <div className="doctor-card">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-medical-dog-health-care-pet-doctor-bichon-bear-photography-charts-image_808932.jpg"
              alt="Dr. Shreemanta"
            />
            <h3>Dr. Shreemanta</h3>
            <p>Degree: MVSc (Veterinary Surgery)</p>
            <p>Experience: 12+ years</p>
            <p>Contact: +456 789 1230</p>
            <p className="doctor-rating">⭐⭐⭐⭐☆ (4.5)</p>
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="feedback-section">
        <h2>What Our Customers Say</h2>
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
    </div>
  );
};

export default CustomerHome;
