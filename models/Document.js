const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // Documents can be in the root directory
  },
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
  },
  fileKey: {
    type: String, // Will be used for S3 integration
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DocumentSchema.index({ originalName: 'text', tags: 'text' });

module.exports = mongoose.model('Document', DocumentSchema);
