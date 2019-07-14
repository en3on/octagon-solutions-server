const express = require('express');
const router = new express.Router();

/* import controller */
const {upload} = require('../controllers/documents-controller');

router.post('/upload', upload);

module.exports = router;
