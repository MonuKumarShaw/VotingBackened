const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  voterNumber: String,
  phone: String,
  email: String,
  address: String,
  hasVoted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);

