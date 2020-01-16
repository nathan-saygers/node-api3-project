// code away!
const express = require('express');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json());

server.use('/api/post', postRouter);
server.use('/api/user', userRouter);

const port = process.env.DB_ENV || 4000;

server.listen(4000, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});