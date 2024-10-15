const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type:  Date,
        default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

blogSchema.pre('find', function() {
    this.populate('comments');
});

blogSchema.pre('findOne', function() {
    this.populate('comments')
});

blogSchema.pre('find', function(next) {
    this.populate('author', 'username');
    next()
});

module.exports = mongoose.model('Blog', blogSchema)