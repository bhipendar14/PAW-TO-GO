import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './register.css';

const Register = () => {
    const navigate = useNavigate(); // Initialize navigate

    // Toast configuration
    const toastConfig = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        closeButton: false,
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        }
    };

    // Success toast configuration
    const successToast = (message) => {
        toast.success(message, {
            ...toastConfig,
            icon: "🎉",
            style: {
                background: '#4CAF50',
                color: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                padding: '16px',
                fontSize: '16px'
            }
        });
    };

    // Error toast configuration
    const errorToast = (message) => {
        toast.error(message, {
            ...toastConfig,
            icon: "😕",
            style: {
                background: '#f44336',
                color: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                padding: '16px',
                fontSize: '16px'
            }
        });
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        identityProof: null,
        address: '',
        bloodGroup: '',
        role: 'user'
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const tempErrors = {};
        if (!formData.name) tempErrors.name = 'Name is required';
        else if (!/^[a-zA-Z\s]+$/.test(formData.name)) tempErrors.name = 'Please Enter valid name';
        if (!formData.email) tempErrors.email = 'Email is required';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) tempErrors.email = 'Invalid email format';

        if (!formData.password) tempErrors.password = 'Password is required';
        else if (formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters';

        if (!formData.phone) tempErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = 'Invalid phone number';

        if (!formData.identityProof) tempErrors.identityProof = 'Identity proof is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const formDataToSend = new FormData();
                Object.keys(formData).forEach((key) => {
                    formDataToSend.append(key, formData[key]);
                });

                await axios.post('http://localhost:5001/api/auth/register', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                successToast('Registration successful! Welcome to Paw To Go! 🐾');

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                errorToast(errorMessage);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="register-container">
                <form onSubmit={handleSubmit} className="form">
                    <h2>Register</h2>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <small>{errors.name}</small>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <small>{errors.email}</small>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        {errors.password && <small>{errors.password}</small>}
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        {errors.phone && <small>{errors.phone}</small>}
                    </div>
                    <div className="form-group">
                        <label>Identity Proof</label>
                        <input type="file" name="identityProof" onChange={handleChange} />
                        {errors.identityProof && <small>{errors.identityProof}</small>}
                    </div>
                    <div className="form-group">
                        <label>Address (optional)</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Blood Group (optional)</label>
                        <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
                    </div>
                    <button type="submit">Register</button>
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </form>
            </div>
        </>
    );
};

export default Register;
