const { errorHandler } = require('../auth');
const Blog = require('../models/Blogs');
const Comment = require("../models/Comments");

module.exports.addComment = async (req, res) => {
    try {
        const post = await Blog.findById(req.params._id || req.params.id);

        if (!post) {
            return res.status(404).send({ error: "Post not found" });
        }

        const newComment = new Comment({
            userId: req.user._id || req.user.id, 
            comments: req.body.comment,
            blog: post._id || post.id,
            postTitle: post.title
        });

        const savedComment = await newComment.save();

        post.comments.push(savedComment._id);

        const updatedPost = await post.save();

        const populatedPost = await Blog.findById(updatedPost._id).populate({
            path: 'comments',
            select: 'userId comments _id',
            model: 'Comment'
        });

        res.status(201).send({ message: "Comment added successfully", updatedPost: populatedPost });
    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.getAllComment = async (req, res) => {
    try {
      const result = await Comment.find({}).populate('userId', 'username');
  
      if (result.length > 0) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({ message: "No comment found" });
      }
    } catch (err) {
      errorHandler(err, req, res);
    }
  };

module.exports.getComment = async (req, res) => {
    try {
        const commentId = req.params._id || req.params.id;

        const comment = await Comment.findById(commentId).populate({
            path: 'blog',
            select: 'title'
        });

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        return res.status(200).send({ comment: comment });
    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.id || req.params._id;
        const userId = req.user._id || req.user.id; 
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).send({ message: "You are not authorized to update this comment" });
        }

        comment.comments = req.body.comment || comment.comments;

        const updatedComment = await comment.save();

        return res.status(200).send({ message: "Comment updated successfully", updatedComment });

    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id || req.params._id;
        const userId = req.user._id || req.user.id; 

        const isAdmin = req.user.isAdmin === true;  
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).send({ message: "You are not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).send({ message: "Comment deleted successfully" });

    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.postId; // Assuming postId is passed in the URL

        // Find all comments related to this post
        const comments = await Comment.find({ blog: postId }).populate('userId', 'username');

        if (comments.length === 0) {
            return res.status(404).send({ message: "No comments found for this post" });
        }

        return res.status(200).send(comments);
    } catch (err) {
        errorHandler(err, req, res);
    }
};
