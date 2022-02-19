const express = require('express');
const {httpGetAllPost} = require('./posts.controller')

const postsRouter = express.Router()

postsRouter.get('/',httpGetAllPost)

module.exports = postsRouter