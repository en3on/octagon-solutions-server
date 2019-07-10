const express = require('express');
const router = express.Router();

app.use('/auth', require('./auth-routes.js'));

module.exports = router;
