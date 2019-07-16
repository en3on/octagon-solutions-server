const express = require('express');
const router = new express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

/* import controller */
const {uploadHandler, deleteHandler} = require('../controllers/documents-controller');

router.post('/upload', upload.array('documents'), uploadHandler);

router.delete('/delete/:public_id', deleteHandler);

module.exports = router;
