const User = require('../models/auth-model');

const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // const BASE_URL = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    // const imagePath = `${BASE_URL}/uploads/${req.file.filename}`;

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pic: imagePath },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile picture uploaded', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadProfilePic,
};
