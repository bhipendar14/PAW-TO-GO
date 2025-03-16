import  { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css";
import Navbar from "../admin/AdminNavbar";

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://paw-to-go.onrender.com/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`https://paw-to-go.onrender.com/api/users/${id}/role`, { role: newRole });
      fetchCustomers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://paw-to-go.onrender.com/api/users/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className="container">
      <h2>Customers</h2>
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
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
              <td>{customer.bloodGroup}</td>
              <td>{customer.role}</td>
              <td>
                <button onClick={() => handleRoleChange(customer._id, "employee")}>Change to Employee</button>
                <button onClick={() => handleDelete(customer._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Customer;
