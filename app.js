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
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup to store uploaded files in a temp folder
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf|docx|doc/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      file.originalname.split(".").pop().toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, videos, and documents are allowed."
        )
      );
    }
  },
});

// API Endpoint to Upload Files
app.post("/upload", upload.single("image"), (req, res) => {
  const path = req.file.path;
  const fileType = req.file.mimetype.split("/")[0]; // get file type (image, video, application)

  // Determine Cloudinary resource type (image, video, raw)
  let resourceType = "image"; // default to image

  if (fileType === "video") {
    resourceType = "video";
  } else if (fileType === "application") {
    resourceType = "raw"; // for PDFs, DOCX, etc.
  }

  // Upload to Cloudinary
  cloudinary.uploader.upload(
    path,
    { resource_type: resourceType },
    (error, result) => {
      if (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: "Upload to Cloudinary failed!" });
      }

      // Delete the file from the local server after upload
      fs.unlinkSync(path);

      // Respond with Cloudinary URL
      res.json({
        message: "File uploaded successfully!",
        url: result.secure_url,
      });
    }
  );
});

// Start the Server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
