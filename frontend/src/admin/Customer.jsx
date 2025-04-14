import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css";
import Navbar from "../admin/AdminNavbar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "https://paw-to-go.onrender.com"; // Local backend URL

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
    closeButton: false
  };

  // Toast configuration for delete confirmation
  const deleteToastConfig = {
    ...toastConfig,
    autoClose: false,
    closeOnClick: false,
    draggable: false
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Using the all-customers endpoint from your backend
      const res = await axios.get(`${API_URL}/api/all-customers`);
      console.log('Customers data:', res.data);
      setCustomers(res.data);
      toast.success('Customers loaded successfully!', toastConfig);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers. Please try again later.");
      toast.error('Failed to load customers!', toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API_URL}/api/users/${id}/role`, { role: newRole });
      await fetchCustomers();
      toast.success('Role updated successfully!', toastConfig);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error('Failed to update role!', toastConfig);
    }
  };

  const handleDelete = async (id) => {
    toast.warning(
      <div>
        Are you sure you want to delete this user?
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => {
              deleteUser(id);
              toast.dismiss();
            }}
            style={{
              padding: '5px 15px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: '5px 15px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      deleteToastConfig
    );
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      await fetchCustomers();
      toast.success('User deleted successfully!', toastConfig);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user!', toastConfig);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>CUSTOMERS</h2>
          <div style={{textAlign: 'center', padding: '20px'}}>Loading customers...</div>
        </div>
        <ToastContainer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>CUSTOMERS</h2>
          <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>{error}</div>
        </div>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>CUSTOMERS</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Blood Group</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address || 'Not provided'}</td>
                  <td>{customer.bloodGroup || 'Not provided'}</td>
                  <td>{customer.role}</td>
                  <td>
                    <button 
                      className="role-button"
                      onClick={() => handleRoleChange(customer._id, "employee")}
                    >
                      Change to Employee
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </>
  );
};

export default Customer;
