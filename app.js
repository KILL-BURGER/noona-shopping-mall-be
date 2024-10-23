const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const mongoURI = process.env.LOCAL_DB_ADDRESS;
mongoose.connect(mongoURI, {useNewUrlParser: true})
  .then(() => {
    console.log('mongoose connection');
  })
  .catch((err) => {
    console.log('DB connection fail', err);
  });

app.listen((process.env.PORT || 5050), () => {
  console.log('server on');
});