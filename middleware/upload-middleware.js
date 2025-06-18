const multer = require('multer');
const path = require('path');

// Disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to /uploads folder
  },
  filename: function (req, file, cb) {
    // Unique filename
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Export multer instance
const upload = multer({ storage });

module.exports = upload;
