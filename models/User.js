const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
