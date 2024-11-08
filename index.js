require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Configure CORS options
const corsOptions = {
  origin: [process.env.CORS_URL, "http://localhost:3000"], // Replace this with your frontend domain
  methods: "GET,POST,PUT,DELETE", // Specify allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
  credentials: true, // Include credentials if needed
};

app.use(cors(corsOptions));

connectDB();

app.use("/api", customerRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
