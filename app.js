const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "https://www.truthcitadelbc.com",
];

// Set up CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow only origins in the allowedOrigins array
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
};

// Apply CORS with the options
app.use(cors(corsOptions));

const port = process.env.PORT || 3019;

// Sample route for testing
app.get("/", (req, res) => {
  res.json({ message: "CORS-enabled for allowed origins!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
