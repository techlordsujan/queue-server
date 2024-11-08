const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    queueNumber: { type: Number, unique: true, required: true },
    status: { type: String, default: "queued" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "passport_renewal" }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
