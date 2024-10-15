const express = require('express');
const blogController = require('../controllers/blogs');
const commentController = require('../controllers/comments');

const { verify } = require('../auth')

const router = express.Router();

// Blogs
router.post('/post', verify, blogController.createPost);
router.get('/getPosts', blogController.getAllPosts);
router.get('/getPosts/:id', verify, blogController.getPost);
router.patch('/updatePost/:id', verify, blogController.updatePost);
router.delete('/deletePost/:id', verify, blogController.deletePost);

// Comments
router.patch('/addComment/:id', verify, commentController.addComment);
router.get('/getComments', verify, commentController.getAllComment);
router.get('/getComment/:id', verify, commentController.getComment);
router.get('/getCommentsByPost/:id', verify,  commentController.getCommentsByPost);
router.patch('/updateComment/:id', verify, commentController.updateComment);
router.delete('/deleteComment/:id', verify, commentController.deleteComment);

module.exports = router;