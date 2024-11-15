const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
  generateAndEncryptUserKey,
  generateIV,
} = require('../utils/encryption');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  encryptedKey: {
    type: String,
    default: null
  },
  iv: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const iv = generateIV();
      // Store the encrypted key in hexadecimal format
      this.encryptedKey = generateAndEncryptUserKey(iv);
      this.iv = iv.toString('hex');
    }

    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
