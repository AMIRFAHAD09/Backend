const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload-middleware');
const { uploadProfilePic } = require('../Controller/upload-controller');

router.post('/profile/:id', upload.single('pic'), uploadProfilePic);

module.exports = router;
