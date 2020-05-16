const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.post('/events', (req, res, next) => {
  const event = req.body;

  axios.post('http://localhost:4000/events', event);
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Event-bus listening on port 4005!');
});
