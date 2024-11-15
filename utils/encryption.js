const crypto = require('crypto');

// Function to decrypt the user's encrypted key
function decryptUserKey(encryptedUserKeyHex, iv) {
  const encryptedUserKey = Buffer.from(encryptedUserKeyHex, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.MASTER_KEY, 'hex'),
    iv
  );
  let decrypted = decipher.update(encryptedUserKey);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted; // Returns the user's key as a Buffer
}

// Function to encrypt data using the user's key and IV
function encryptData(dataBuffer, userKey, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', userKey, iv);
  let encrypted = cipher.update(dataBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
}

// Function to decrypt data using the user's key and IV
function decryptData(encryptedBuffer, userKey, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', userKey, iv);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}

// Function to generate a random IV
function generateIV() {
  return crypto.randomBytes(16);
}

// Function to generate and encrypt a user's key
function generateAndEncryptUserKey(iv) {
  // Generate a random 32-byte (256-bit) user key
  const userKey = crypto.randomBytes(32);

  // Encrypt the userKey with the application's master key
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.MASTER_KEY, 'hex'),
    iv
  );
  let encryptedKey = cipher.update(userKey);
  encryptedKey = Buffer.concat([encryptedKey, cipher.final()]);

  // Return the encrypted user key in hexadecimal format
  return encryptedKey.toString('hex');
}

module.exports = {
  decryptUserKey,
  encryptData,
  decryptData,
  generateIV,
  generateAndEncryptUserKey,
};
