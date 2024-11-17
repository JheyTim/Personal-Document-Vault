const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createFolder,
  getAllFolder,
  deleteFolder,
} = require('../controllers/folderController');

// @route   POST /api/folders
// @desc    Create a new folder
// @access  Private
router.post('/', auth, createFolder);

// @route   GET /api/folders
// @desc    Get all folders for a user
// @access  Private

router.get('/', auth, getAllFolder);

// @route   DELETE /api/folders/:id
// @desc    Delete a folder
// @access  Private
router.delete('/:id', auth, deleteFolder);

module.exports = router;
