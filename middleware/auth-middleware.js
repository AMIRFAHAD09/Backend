//jwt verification 
const jwt = require('jsonwebtoken');
const User = require('../models/auth-model')
const protect = async(req, res, next) => {

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
const jwtToken = token.replace("Bearer ",'');
// console.log("Authorization Header:", token);
// console.log("JWT Secret:", process.env.JWT_SECRET_KEY);
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // console.log("Decoded Token:", decoded);
    const userData = await User.findById(decoded.id)
    req.user = userData;
    // console.log(userData)
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;
