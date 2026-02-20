const express = require("express");
const router = express.Router();

const {
  registerStudent,
  getAllUsers,
  getUsersByTrack,
  deleteUser,
  confirmPayment
} = require("../controllers/paymentController");

const auth = require("../middleware/authMiddleware");

router.post("/register", registerStudent);
router.get("/users", auth, getAllUsers);
router.get('/users/track/:track', auth, getUsersByTrack);
router.delete("/users/:id", auth, deleteUser);
router.post("/payment-confirmation", confirmPayment);


module.exports = router;
