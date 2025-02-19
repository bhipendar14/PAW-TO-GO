const express = require("express");
const User = require("../models/User"); // Import User model
const router = express.Router();

// ✅ Update User Role (Only between "user" and "employee")
router.put("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!["employee", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role update" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Prevent unnecessary updates
    if (user.role === role) {
      return res.status(400).json({ message: "User already has this role" });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role} successfully`, user });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating user role", error });
  }
});

// ✅ Delete User (Prevent deleting admins if necessary)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ❗ Optional: Prevent admin deletion
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// ✅ Get All Customers (Users with role: "user")
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password -identityProof");
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers", error });
  }
});

// ✅ Get All Employees (Users with role: "employee")
router.get("/employees", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password -identityProof");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees", error });
  }
});




module.exports = router;
