import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css";
import Navbar from "../admin/AdminNavbar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5001"; // Local backend URL

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
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Using the all-employees endpoint from your backend
      const res = await axios.get(`${API_URL}/api/all-employees`);
      console.log('Employees data:', res.data);
      setEmployees(res.data);
      toast.success('Employees loaded successfully!', toastConfig);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again later.");
      toast.error('Failed to load employees!', toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API_URL}/api/users/${id}/role`, { role: newRole });
      await fetchEmployees();
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
      await fetchEmployees();
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
          <h2>EMPLOYEES</h2>
          <div style={{textAlign: 'center', padding: '20px'}}>Loading employees...</div>
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
          <h2>EMPLOYEES</h2>
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
        <h2>EMPLOYEES</h2>
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
            {employees && employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address || 'Not provided'}</td>
                  <td>{employee.bloodGroup || 'Not provided'}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button 
                      className="role-button"
                      onClick={() => handleRoleChange(employee._id, "user")}
                    >
                      Change to User
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>
                  No employees found
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

export default Employee;
