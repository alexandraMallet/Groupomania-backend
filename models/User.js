const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseError = require("mongoose-errors");

const userSchema = mongoose.Schema({
    email: {type : String, required : true, unique : true},
    password: {type : String, required : true},
    //avatarUrl: {type : String, required : true},
    //pseudo: {type : String, required : true, unique : true},
    //posts: {type : [String]}
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseError);

module.exports = mongoose.model("User", userSchema);