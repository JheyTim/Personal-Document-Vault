const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = './temp_uploads';

// Set storage engine
const storage = multer.diskStorage({
  destination: tempDir,
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

// Initialize upload variable
const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const checkFileType = (file, cb) => {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf|doc|docx|txt/;

  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (!mimetype && !extname) {
    return cb(new Error('Unsupported file type'));
  }

  return cb(null, true);
};

// Ensure the temp_uploads directory exists
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

module.exports = upload;
