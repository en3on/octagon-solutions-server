const express = require('express');
const router = new express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

/* import controller */
const {uploadHandler} = require('../controllers/documents-controller');

router.post('/upload', upload.array('documents'), uploadHandler);

module.exports = router;
