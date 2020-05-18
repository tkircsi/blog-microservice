const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { randomBytes } = require('crypto');
const morgan = require('morgan');
const axios = require('axios');

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

app.post('/posts/:postId/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const { postId } = req.params;

  const comments = commentsByPostId[postId] || [];
  comments.push({
    id: commentId,
    content,
  });
  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId,
    },
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  res.send('OK');
});

app.listen(4001, () => {
  console.log('Comments service listening on port 4001!');
});
