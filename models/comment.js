// Import Requires
const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String
  }
});

// Comment Model
const Comment = mongoose.model('Comment', commentSchema);

// Export the Model
module.exports = Comment;
