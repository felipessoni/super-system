const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostComment = require('./PostComment');

// Schema for forum posts

const forumPostSchema = new Schema({

    userName: {
        type: String,
        required: true,
    },
    userPicture: String,

    title: {
        type: String,
        required: true,
    },
    body: String,
    imgKey: String,

    likedUsers: [String],
    dislikedUsers: [String],

    comments: [{type: Schema.Types.ObjectId, ref: PostComment}],

}, { timestamps: true });

// Create model for forum-post collection

const ForumPost = mongoose.model('forum-post', forumPostSchema);

module.exports = ForumPost;