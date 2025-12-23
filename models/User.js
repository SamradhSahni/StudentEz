const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  name: String,
  email: String,
  isAdmin: { type: Boolean, default: false }, 
});

module.exports = mongoose.model("User1", userSchema);
