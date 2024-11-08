const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const dotenv = require("dotenv");
const { sendEmail } = require("../utils/emailService");
const sendSMS = require("../utils/smsService");
dotenv.config(); // Load environment variables

// Admin login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all customers in queue (requires admin authorization)
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({
      status: -1,
      queueNumber: 1,
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queue list", error });
  }
});

// Route to mark a customer as completed (requires admin authorization)
router.put("/queue/:id/complete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const customer = await Customer.findOne({ _id: id, status: "queued" });

    await Customer.findByIdAndUpdate(id, { status: "completed" });

    // await sendEmail(
    //   customer.email,
    //   "Biometric Completed",
    //   "Your biometric application is completed. You will be informed when the passport is ready."
    // );

    const nextCustomer = await Customer.findOne({
      status: "queued",
      queueNumber: customer.queueNumber + 5,
    }).sort({
      queueNumber: 1,
    });
    if (nextCustomer) {
      await sendEmail(
        nextCustomer.email,
        "It’s Your Turn",
        "Please proceed for biometric processing."
      );
      if (process.env.SEND_SMS) {
        await sendSMS(
          nextCustomer.phone.startsWith("+1")
            ? nextCustomer.phone
            : "+1" + nextCustomer.phone,
          "Please proceed for biometric processing."
        );
      }
    }
    res.json({ message: "Customer marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer status", error });
  }
});

module.exports = router;
