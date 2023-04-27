const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('request');
const CircularJSON = require('circular-json');

const app = express();

app.set('port', process.env.PORT || 8000);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://192.168.1.15:27017/test');

let main = require('./routes/main.js');
app.use('/', main);

let option = 'http://192.168.1.15:8000/hello';
app.get('/rhello', function (req, res) {
   request(option, { json: true }, (err, result, body) => {
      if (err) {
         return console.log(err);
      }
      res.send(CircularJSON.stringify(body));
   });
});

const data = JSON.stringify({ todo: 'Buy the milk - Moon' });
app.get('/data', function (req, res) {
   res.send(data);
});

option = 'http://192.168.1.15:8000/data';
app.get('/rdata', function (req, res) {
   request(option, { json: true }, (err, result, body) => {
      if (err) {
         return console.log(err);
      }
      res.send(CircularJSON.stringify(body));
   });
});

app.listen(app.get('port'), () => {
   console.log('8000 Port : Server Started...');
});
