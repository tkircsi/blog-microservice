const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { randomBytes } = require('crypto');
const morgan = require('morgan');

const app = express();

const commentsByPostId = {};

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const { id } = req.params;

  const comments = commentsByPostId[id] || [];
  comments.push({
    id: commentId,
    content,
  });
  commentsByPostId[id] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Comments service listening on port 4001!');
});
