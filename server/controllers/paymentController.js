const Student = require('../models/Students');
const sendEmail = require('../utils/sendEmail');
const axios = require("axios");

exports.registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      track,
      address,
      state,
      age,
      gender,
      occupation,
      educationLevel,
      hasLaptop,
      priorTechExperience
    } = req.body;

    if (
      !fullName || !email || !phone || !track ||
      !address || !state || !age || !gender ||
      !occupation || !educationLevel ||
      !hasLaptop || !priorTechExperience
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student already registered" });
    }

    const student = await Student.create({
      fullName,
      email,
      phone,
      track,
      address,
      state,
      age,
      gender,
      occupation,
      educationLevel,
      hasLaptop,
      priorTechExperience,
      paymentStatus: "pending"
    });

    // Don't let email crash registration
    try {
      await sendEmail(
        email,
        "Bootcamp Registration Successful",
        `<h3>Hello ${fullName},</h3>
        <p>Congartulations on your registrations for the bootcamp. Your registration was successful</p>
         `
      );
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    res.status(201).json({
      message: "Registration successful",
      student
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Student.find()
      .select(
        'fullName email phone address state age gender occupation educationLevel hasLaptop priorTechExperience track paymentStatus createdAt paymentReference'
      )
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= FILTER BY TRACK =================
exports.getUsersByTrack = async (req, res) => {
  try {
    const { track } = req.params;

    const users = await Student.find({ track })
      .select('fullName email phone address state age gender occupation educationLevel hasLaptop priorTechExperience track paymentStatus createdAt paymentReference')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { email, reference } = req.body;

   
    const verify = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      }
    );

    if (verify.data.data.status !== "success") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.paymentStatus = "paid";
    student.paymentReference = reference;
    await student.save();

    res.json({ message: "Payment verified and saved" });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
