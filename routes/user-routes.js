const express = require('express');
const router = new express.Router();
const {changeUserSettingsHandler}
    = require('../controllers/users-controller.js');

router.post('/changeSettings', changeUserSettingsHandler);

module.exports = router;
