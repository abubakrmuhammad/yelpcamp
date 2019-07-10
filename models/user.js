// Import Requires
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Plug in passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// User Model
const User = mongoose.model('User', userSchema);

// Export the Model
module.exports = User;
