const express = require('express');
const router = new express.Router();

router.use('/auth', require('./auth-routes.js'));
router.use('/documents', require('./document-routes.js'));

/* REMOVE BEFORE PRODUCTION */
router.use('/test', require('./test-routes.js'));
/* REMOVE BEFORE PRODUCTION */

module.exports = router;
