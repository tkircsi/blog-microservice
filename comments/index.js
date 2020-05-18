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
    status: 'pending',
  });
  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId,
      status: 'pending',
    },
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        ...comment,
        postId,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Comments service listening on port 4001!');
});
