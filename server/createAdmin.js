const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const hash = await bcrypt.hash("xova123", 10);
  await Admin.create({ username: "Xova Studios", password: hash });
  console.log("Admin created");
  process.exit();
})();
