import  { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css";
import Navbar from "../admin/AdminNavbar"

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://paw-to-go.onrender.com/api/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`https://paw-to-go.onrender.com/api/users/${id}/role`, { role: newRole });
      fetchEmployees();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://paw-to-go.onrender.com/api/users/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className="container">
      <h2>Employees</h2>
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
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.address}</td>
              <td>{employee.bloodGroup}</td>
              <td>{employee.role}</td>
              <td>
                <button onClick={() => handleRoleChange(employee._id, "user")}>Change to User</button>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Employee;
