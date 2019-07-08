require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URL, {useNewUrlParser: true}, (err) => {
  console.log(err || 'Connected to MongoDB');
});

const server = app.listen(process.env.PORT, () => {
  const {address, port} = server.address();

  console.log(`Listening on ${address}:${port}`);
});
