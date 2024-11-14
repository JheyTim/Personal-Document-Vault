const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../config/s3Client');
const path = require('path');

// Set storage engine
const storage = multerS3({
  s3: s3Client,
  bucket: process.env.S3_BUCKET_NAME,
  acl: 'private', // Make sure files are not publicly accessible
  key: function (req, file, cb) {
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

module.exports = upload;
