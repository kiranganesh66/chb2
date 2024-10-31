const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 30,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "", 
  },
});

module.exports = mongoose.model("chatUsers", schema, "chatUsers");
