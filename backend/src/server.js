const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();
const postsRouter = require('./routes/posts/posts.router')

const PORT = process.env.PORT || 8000;
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
//routes
app.use('/service/authors/:authorId/posts',postsRouter)
//static files
//use this as the last routes, else it might interfere with other routes used for depolyment
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}... `);
});
