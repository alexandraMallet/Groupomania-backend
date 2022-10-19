const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseError = require("mongoose-errors");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {type: Boolean, default: false},
    avatarUrl: { type: String, required: true },
    pseudo: { type: String, required: true, unique: true },
    posts: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ]
});


userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseError);

const User = mongoose.model("User", userSchema);

module.exports = User;