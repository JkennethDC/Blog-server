const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogs",
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    postTitle: {
        type: String
    }
});

commentSchema.pre('find', function(next) {
    this.populate('userId', 'username');
    next();
});

commentSchema.pre('findOne', function(next) {
    this.populate('userId', 'username');
    next();
});

module.exports = mongoose.model("Comment", commentSchema);
