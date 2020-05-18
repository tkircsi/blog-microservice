const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        ...data,
        status,
      },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('Moderation service listening on port 4003!');
});
