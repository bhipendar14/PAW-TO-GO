import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarUser"; // Ensure Navbar is correctly imported
import "./CustomerProfile.css";

const CustomerProfile = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(""); // Profile image state
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            // Ensure all fields are available, set default values if missing
            const completeUser = {
                name: parsedUser.name || "N/A",
                role: parsedUser.role || "User",
            };

            setUser(completeUser);

            // ✅ Generate a unique profile image for each user
            const uniqueProfileImage = `https://robohash.org/${parsedUser.name}.png?size=150x150`;
            setProfileImage(uniqueProfileImage);
        } else {
            navigate("/login"); // Redirect to login if no user found
        }
    }, [navigate]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Navigate to Chat page
    const handleTalkClick = () => {
        navigate("/customer/chat"); // Navigate to the Chat page
    };

    return (
        <>
            <Navbar /> {/* Include Navbar at the top */}
            <div className="profile-container">
                <h2>Profile</h2>
                {user ? (
                    <div className="profile-card">
                        <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="profile-image"
                            onError={(e) => e.target.src = "https://via.placeholder.com/150"} // Fallback image
                        />

                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Role:</strong> {user.role}</p>

                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                        <button className="talk-button" onClick={handleTalkClick}>Talk with Our Experts</button>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </>
    );
};

export default CustomerProfile;
