const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization denied, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth