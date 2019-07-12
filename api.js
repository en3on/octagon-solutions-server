require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

/* Require Routes */
const ROUTES = require('./routes/');

app.use(cors());
app.use(express.json());

app.use('/', ROUTES);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      name: error.name,
      message: error.message,
    }
  })
});

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err) => {
  console.log(err || 'Connected to MongoDB');
});

const api = app.listen(PORT, () => {
  const {address, port} = api.address();

  console.log(`Listening on ${address}:${port}`);
});

module.exports = api;
