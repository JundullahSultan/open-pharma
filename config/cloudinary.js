const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
// require('dotenv').config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: "dirvrzga7",
  api_key: "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",
  api_secret: "Gu2I2bwiGQdG6xa5H8jQrerkg2o",
});

// 2. Configure Storage Settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shahi-pharma", // The folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// 3. Export the Multer Upload Middleware
const upload = multer({ storage: storage });

module.exports = upload;
