const express = require('express');
const router = new express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({storage});

/* import controller */
const {uploadHandler, deleteHandler, getUserDocuments} = require('../controllers/documents-controller');

router.post('/upload', upload.array('documents'), uploadHandler);

router.get('/user/:id', getUserDocuments);

router.delete('/delete/:publicId', deleteHandler);

module.exports = router;
