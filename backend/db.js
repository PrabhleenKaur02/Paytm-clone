const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://kaurprabhleen2002:EGiNeRa7yLhNuZc1@cluster0.ih4d0ql.mongodb.net/paytm");

const userSchema = {
    username: String,
    firstName: String,
    lastName: String,
    password: String
};

const User = mongoose.model('User', userSchema);

module.exports = User;