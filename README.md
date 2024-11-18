# Personal Document Vault with Encryption

## Overview
Personal Document Vault is a secure REST API that allows users to upload, store, organize, and manage personal documents with end-to-end encryption. Built with Node.js, MongoDB, AWS S3, and integrated encryption to ensure data privacy and security, this API provides a safe and organized way to handle sensitive documents.

## Features
* **Secure User Authentication**
  * JWT-based authentication.
  * Password hashing with bcrypt

* **Encrypted Document Storage**
  * End-to-end encryption using AES-256-CBC
  * Unique encryption keys per user

* **Organize Documents**
  * Create folders and subfolders
  * Move documents between folders

* **Tagging System**
  * Add, edit, and remove tags on documents
  * Search documents by tags

* **Search Functionality**
  * Search by document name or tags
  * Case-insensitive and partial matches

## Tech Stack
* **Node.js**: JavaScript runtime for server-side development.
* **Express.js**: Minimal Node.js framework for web and mobile apps.
* **MongoDB**: NoSQL database for JSON-like, schema-flexible data.
* **Mongoose**: ODM library for MongoDB with schema-based modeling.
* **AWS S3**: Scalable file storage with high availability and security.
* **@aws-sdk/client-s3**
* **bcrypt**: Library for secure password hashing.
* **jsonwebtoken (JWT)**: Compact token for authentication and data exchange.
* **Crypto Module**: Node.js module for encryption and decryption.
* **multer**: Middleware for handling file uploads in Node.js.
* **dotenv**: Loads environment variables from .env files.

## Installation

### Prerequisites

* **Node.js** (v14.x or higher)
* **MongoDB** (local installation or MongoDB Atlas account)
* **AWS Account** with S3 access

### Steps
1. **Clone the Repository**
    ```bash
    git clone https://github.com/JheyTim/Personal-Document-Vault.git
    cd Personal-Document-Vault
    ```
2. **Install Dependencies**
    ```bash
    npm install
    ```
3. **Set Up Environment Variables**
Create a .env file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGODB_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    MASTER_KEY=your-64-character-hex-string
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    AWS_REGION=your-aws-region
    S3_BUCKET_NAME=your-s3-bucket-name
    ```
* Replace placeholders with your actual credentials.

4. **Run the Application**
    ```bash
    npm run dev
    ```

## License
This project is licensed under the [MIT License](LICENSE).