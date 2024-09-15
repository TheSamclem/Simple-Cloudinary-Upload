require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cors = require("cors");
// Initialize Express App
const app = express();
const port = 3019;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "http://localhost",
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
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup to store the uploaded file in a temp folder
const upload = multer({ dest: "uploads/" });

// API Endpoint to Upload Image
app.post("/upload", upload.single("image"), (req, res) => {
  const path = req.file.path;

  // Upload to Cloudinary
  cloudinary.uploader.upload(path, (error, result) => {
    if (error) {
      console.error("Upload Error:", error);
      return res.status(500).json({ error: "Upload to Cloudinary failed!" });
    }

    // Delete the file from the local server after upload
    fs.unlinkSync(path);

    // Respond with Cloudinary URL
    res.json({
      message: "Image uploaded successfully!",
      url: result.secure_url,
    });
  });
});

// Start the Server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
