const mongoose = require("mongoose");

/**
 * Customer model extends User model with pet-specific information
 * The User model handles authentication and common fields
 * This model handles pet owner specific details
 */
const customerSchema = new mongoose.Schema({
  // Reference to User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // Additional customer-specific fields
  pets: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["Dog", "Cat", "Bird", "Other"],
      default: "Dog"
    },
    breed: String,
    age: Number,
    weight: Number,
    medicalHistory: String,
    photo: String
  }],
  preferredServices: [{
    type: String,
    enum: ["Grooming", "Boarding", "Training", "Veterinary", "Walking", "DayCare"]
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  // Track customer activity and loyalty
  lastVisit: Date,
  totalBookings: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
