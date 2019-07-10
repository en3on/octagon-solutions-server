const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth-routes.js'));

/* REMOVE BEFORE PRODUCTION */
router.use('/test', require('./test-routes.js'));
/* REMOVE BEFORE PRODUCTION */

module.exports = router;
