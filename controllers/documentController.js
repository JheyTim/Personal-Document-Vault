const {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const fs = require('fs');
const s3Client = require('../config/s3Client');
const Document = require('../models/Document');
const User = require('../models/User');
const Folder = require('../models/Folder');
const {
  decryptUserKey,
  encryptData,
  decryptData,
} = require('../utils/encryption');

exports.uploadFile = async (req, res) => {
  try {
    const { folderId } = req.body;

    // Validate file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate folderId
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, userId: req.user });
      if (!folder) {
        return res.status(400).json({ message: 'Invalid folder ID' });
      }
    }

    // Retrieve user's encryption key
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Get IV
    const iv = Buffer.from(user.iv, 'hex');

    // Decrypt user's key
    const userKey = decryptUserKey(user.encryptedKey, iv);

    // Read the file data
    const fileBuffer = fs.readFileSync(req.file.path);

    // Encrypt the file
    const encryptedData = encryptData(fileBuffer, userKey, iv);

    // Upload encrypted file to S3
    const fileName = req.file.filename;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: encryptedData,
      ACL: 'private',
    };

    const command = new PutObjectCommand(params);

    await s3Client.send(command);

    // Delete the temp file
    fs.unlinkSync(req.file.path);

    const document = new Document({
      userId: req.user,
      folderId: folderId || null,
      fileName: fileName,
      originalName: req.file.originalname,
      fileKey: fileName,
      tags: req.body.tags ? req.body.tags.split(',') : [],
    });

    await document.save();

    res
      .status(201)
      .json({ message: 'File uploaded and encrypted successfully', document });
  } catch (error) {
    console.error('S3 Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    // Check if document exists and belongs to the user
    if (!document || document.userId.toString() !== req.user) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Retrieve user's encryption key
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Get IV
    const iv = Buffer.from(user.iv, 'hex');

    // Decrypt user's key
    const userKey = decryptUserKey(user.encryptedKey, iv);

    // Create a GetObjectCommand instance
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: document.fileKey,
    });

    // Send the command to S3
    const response = await s3Client.send(command);

    // The Body contains the readable stream
    const fileStream = response.Body;

    // Read the stream into a buffer
    const chunks = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // Decrypt the file
    const decryptedData = decryptData(fileBuffer, userKey, iv);

    // Set the headers
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${document.originalName}"`
    );
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send the decrypted file
    res.send(decryptedData);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.userId.toString() !== req.user) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Create a DeleteObjectCommand
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: document.fileKey,
    });

    // Send the command to S3
    await s3Client.send(command);

    // Delete document record from MongoDB
    await Document.deleteOne({ _id: document._id });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDocumentsInSpecificFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    // Validate folderId
    if (folderId !== 'null') {
      const folder = await Folder.findOne({ _id: folderId, userId: req.user });
      if (!folder) {
        return res.status(400).json({ message: 'Folder not found' });
      }
    }

    const documents = await Document.find({
      userId: req.user,
      folderId: folderId !== 'null' ? folderId : null,
    });

    res.json({ documents });
  } catch (error) {
    console.error('Get Documents Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTags = async (req, res) => {
  try {
    const { tags } = req.body;

    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user,
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.tags = tags ? tags.split(',').map((tag) => tag.trim()) : [];
    await document.save();

    res.json({ message: 'Tags updated', document });
  } catch (error) {
    console.error('Update Tags Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchDocumentsByNameOrTags = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(query, 'i'); // Case-insensitive search

    const documents = await Document.find({
      userId: req.user,
      $or: [{ originalName: regex }, { tags: regex }],
    });

    res.json({ documents });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
