const router = require('express').Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  uploadFile,
  downloadFile,
  deleteFile,
  getDocumentsInSpecificFolder,
  updateTags,
  searchDocumentsByNameOrTags,
} = require('../controllers/documentController');

// @route   POST /api/documents/upload
// @desc    Upload a document
// @access  Private
router.post('/upload', auth, upload.single('file'), uploadFile);

// @route   GET /api/documents/download/:id
// @desc    Download a document
// @access  Private
router.get('/download/:id', auth, downloadFile);

// @route   GET /api/documents/folder/:folderId
// @desc    Get documents in a specific folder
// @access  Private
router.get('/folder/:folderId', auth, getDocumentsInSpecificFolder);

// @route   GET /api/documents/search
// @desc    Search documents by name or tags
// @access  Private
router.get('/search', auth, searchDocumentsByNameOrTags);

// @route   PUT /api/documents/:id/tags
// @desc    Update tags for a document
// @access  Private
router.put('/:id/tags', auth, updateTags);

// routes/documents.js
// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, deleteFile);

module.exports = router;
