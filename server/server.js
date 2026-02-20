require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// For admin routes if using HTML files
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/admin.html'));
});

app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "client/admin-login.html"));
});

// For index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.use("/api", paymentRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Server Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
