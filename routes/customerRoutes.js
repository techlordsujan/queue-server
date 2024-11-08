const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const {
  registerCustomer,
  customerQueueInfo,
} = require("../controllers/customerController");

router.post("/register", registerCustomer);
router.get("/queue/info", customerQueueInfo);

module.exports = router;
