// controllers/queueController.js
const Customer = require("../models/Customer"); // Assuming Queue is your Mongoose model
const { sendEmail } = require("../utils/emailService");
require("dotenv").config();
// Controller for registering a new customer
async function registerCustomer(req, res) {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const lastCustomer = await Customer.findOne().sort({ queueNumber: -1 });
    const queueNumber = lastCustomer ? lastCustomer.queueNumber + 1 : 1;

    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phone,
      queueNumber,
    });
    await newCustomer.save();

    res.status(201).json({
      message: "Customer registered successfully",
      customer: newCustomer,
    });
    await sendEmail(
      email,
      "Registration Confirmed",
      `You are registered with queue number: ${queueNumber}  You can track your queuing time by clicking this link:  ${
        process.env.DASHBOARD_URL + "#/customer/dashboard?email=" + email
      }`
    );
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
      });
    }
    console.error("Error registering customer:", error);
    res
      .status(500)
      .json({ message: "Failed to register customer", details: error.message });
  }
}

async function customerQueueInfo(req, res) {
  const { email } = req.query;
  const customer = await Customer.findOne({ email });
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  const remainingQueue = await Customer.countDocuments({
    queueNumber: { $lt: customer.queueNumber },
    status: { $ne: "completed" },
  });
  console.log(remainingQueue);
  res.json({
    remainingQueue,
    estimatedTime: remainingQueue * process.env.TIME_PER_CUSTOMER,
  });
}

module.exports = { registerCustomer, customerQueueInfo };
