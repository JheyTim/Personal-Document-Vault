const { GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Client');
const Document = require('../models/Document');

exports.uploadFile = async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = new Document({
      userId: req.user,
      fileName: req.file.key,
      originalName: req.file.originalname,
      fileKey: req.file.key, // S3 object key
      tags: req.body.tags ? req.body.tags.split(',') : [],
    });

    await document.save();

    res.status(201).json({ message: 'File uploaded to S3', document });
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

    // Create a GetObjectCommand instance
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: document.fileKey,
    });

    // Send the command to S3
    const response = await s3Client.send(command);

    // The Body contains the readable stream
    const fileStream = response.Body;

    // Set headers
    res.attachment(document.originalName);

    // Pipe the file stream to the response
    fileStream.pipe(res).on('error', (error) => {
      console.error('Download error:', error);
      res.status(500).json({ message: 'Error downloading file' });
    });
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
