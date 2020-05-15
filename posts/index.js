const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { randomBytes } = require('crypto');
const morgan = require('morgan');

const app = express();

const posts = {};

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('Posts service listening on port 4000!');
});
