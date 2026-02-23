const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  occupation: { type: String, required: true },
  educationLevel: { type: String, required: true },
  hasLaptop: { type: String, required: true }, // "Yes" or "No"
  priorTechExperience: { type: String, required: true }, // "Yes" or "No"
  classSchedule: { type: String, enum: ["Online Class", "Physical Class"], required: true },
  track: {
    type: String,
    enum: ["Web Development", "Web Design","Graphic Design","UI/UX"],
    required: true
  },
  amount: {
    type: Number,
    default: 3000
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  paymentReference: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
