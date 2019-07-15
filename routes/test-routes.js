const express = require('express');
const router = new express.Router();

router.use('/hello', (req, res) => {
  return res.send('Hello World!');
});

module.exports = router;
