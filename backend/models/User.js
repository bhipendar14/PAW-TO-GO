const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    bloodGroup: { type: String },
    identityProof: { type: String }, 
    role: { type: String, enum: ["admin", "employee", "user"], required: true },
});

module.exports = mongoose.model("User", UserSchema);
