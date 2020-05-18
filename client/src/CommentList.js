import React from 'react';

export default ({ comments }) => {
  const renderedComments = comments.map(({ id, content, status }) => {
    if (status === 'pending') {
      content = 'This comment is waiting moderation';
    }

    if (status === 'rejected') {
      content = 'This comment has been rejected!';
    }
    return <li key={id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
