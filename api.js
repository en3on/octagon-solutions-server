require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const PORT = process.env.PORT || 5000;

/* Require Routes */
const ROUTES = require('./routes/');

/* Require Error Handlers */
const {errorHandler} = require('./utils/error-utils.js');

app.use(cors());
app.use(express.json());

app.use(morgan('dev', {
  skip: function(req, res) {
    return req.headers.test;
  },
}));

app.use('/', ROUTES);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err) => {
  console.log(err || 'Connected to MongoDB');
});

const api = app.listen(PORT, () => {
  const {address, port} = api.address();

  console.log(`Listening on ${address}:${port}`);
});

module.exports = api;
