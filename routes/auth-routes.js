const express = require('express');
const router = express.Router();
const {register} = require('../controllers/auth-controller.js');

router.post('/register', 
