const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadCSV } = require('../controllers/charge');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', upload.single('file'), uploadCSV);


module.exports = router;
