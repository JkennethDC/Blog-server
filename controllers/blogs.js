const { errorHandler } = require('../auth');
const Blog = require('../models/Blogs');
const User = require('../models/User');

module.exports.createPost = async (req, res) => {
    try {
        const existingPost = await Blog.findOne({ title: req.body.title });

        if (existingPost) {
            return res.status(409).send({ message: 'Blog already exists ' });
        }

        const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id || req.user.id
        });

        const result = await newBlog.save();
        const populatedResult = await result.populate('author', 'username')
        return res.status(201).send(populatedResult);
        
    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        const result = await Blog.find({}).populate('author', 'username');

        if (result.length > 0) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({ message: "No posts found" });
        }

    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.getPost = async (req, res) => {
    try {
        const result = await Blog.findById(req.params.id || req.params._id).populate('author', 'username');

        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send({ message: "Post not found" });
        }
        
    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id || req.params._id;  
        const userId = req.user._id || req.user.id;   

        const post = await Blog.findById(postId);

        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).send({ message: "You are not authorized to update this post" });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.updatedAt = Date.now();  

        await post.save();

        return res.status(200).send({ message: "Post updated successfully", post });

    } catch (err) {
        errorHandler(err, req, res)
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id || req.params._id;
        const userId = req.user._id || req.user.id;
        const isAdmin = req.user.isAdmin === true; 

        const post = await Blog.findById(postId);

        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        if (post.author.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).send({ message: "You are not authorized to delete this post" });
        }

        await Blog.findByIdAndDelete(postId);

        return res.status(200).send({ message: "Post deleted successfully" });

    } catch (err) {
        errorHandler(err, req, res)
    }
};
