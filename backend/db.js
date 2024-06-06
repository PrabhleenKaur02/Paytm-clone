const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://kaurprabhleen2002:EGiNeRa7yLhNuZc1@cluster0.ih4d0ql.mongodb.net/paytm");

// USER SCHEMA
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);


// BANK ACCOUNT SCHEMA
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  balance: {
    type: Number,
    required: true
  }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = {
  User,
  Account
};