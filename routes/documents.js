const router = require('express').Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  uploadFile,
  downloadFile,
  deleteFile,
} = require('../controllers/documentController');

// @route   POST /api/documents/upload
// @desc    Upload a document
// @access  Private
router.post('/upload', auth, upload.single('file'), uploadFile);

// @route   GET /api/documents/download/:id
// @desc    Download a document
// @access  Private
router.get('/download/:id', auth, downloadFile);

// routes/documents.js
// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, deleteFile);

module.exports = router;
