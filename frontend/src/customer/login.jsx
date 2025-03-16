import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import Navbar from "../components/Navbar";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Navigation hook

    // Validation function
    const validate = () => {
        const tempErrors = {};
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
            tempErrors.email = "Invalid email format";

        if (!formData.password) tempErrors.password = "Password is required";
        else if (formData.password.length < 6)
            tempErrors.password = "Password must be at least 6 characters";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    "https://paw-to-go.onrender.com/api/auth/login",
                    formData
                );

                const { token, user } = response.data;

                // Store token & user data
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                toast.success("Login successful!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    className: "custom-toast",
                    closeButton: true,
                });

                // Redirect based on role
                if (user.role === "user") {
                    setTimeout(() => navigate("/homeusers"), 2000);
                } else if (user.role === "employee") {
                    setTimeout(() => navigate("/employee/home"), 2000);
                } else if (user.role === "admin") {
                    setTimeout(() => navigate("/admin/home"), 2000);
                } else {
                    toast.error("Invalid role detected!");
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Invalid credentials!",
                    {
                        position: "top-center",
                        autoClose: 3000,
                        className: "custom-toast",
                        closeButton: true,
                    });
                
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <form onSubmit={handleSubmit} className="form">
                    <h2>Login</h2>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <small>{errors.email}</small>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <small>{errors.password}</small>}
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <p>
                        Don’t have an account? <Link to="/register">SignUp</Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Login;
