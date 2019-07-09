require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err) => {
  console.log(err || 'Connected to MongoDB');
});

const server = app.listen(PORT, () => {
  const {address, port} = server.address();

  console.log(`Listening on ${address}:${port}`);
});
