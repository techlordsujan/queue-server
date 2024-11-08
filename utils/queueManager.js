const Customer = require("../models/Customer");
const { sendEmail } = require("./emailService");
require("dotenv").config();
// async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Customer.findByIdAndUpdate(id, { status: "completed" });
//     res.json({ message: "Customer marked as completed" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating customer status", error });
//   }
// });
async function completeCustomer(req, res) {
  id = req.params;
  console.log(id);
  const customer = await Customer.findOne({ id, status: "queued" });

  if (!customer) return null;

  customer.status = "completed";
  await customer.save();

  await sendEmail(
    customer.email,
    "Biometric Completed",
    "Your biometric application is completed. You will be informed when the passport is ready."
  );

  const nextCustomer = await Customer.findOne({ status: "queued" }).sort({
    queueNumber: 1,
  });
  if (nextCustomer) {
    await sendEmail(
      nextCustomer.email,
      "It’s Your Turn",
      "Please proceed for biometric processing."
    );
  }

  return customer;
}

module.exports = completeCustomer;
