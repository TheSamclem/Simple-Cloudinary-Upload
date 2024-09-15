require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Initialize Express App
const app = express();
const port = 3019;

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
