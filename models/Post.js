const mongoose = require("mongoose");
const mongooseError = require("mongoose-errors");



const postSchema = new mongoose.Schema({
    userId : {type : String, required : true},
    userPseudo : {type: String, required : true},
    text : {type : String},
    imageUrl : {type : String},
    usersLiked : {type : Number, default : 0},
    createdAt : {type : Date, required : true},
    modifiedAt: {type : Date},
    modifiedBy: {type: String},
    likes : {type : Number, default : 0},
    dislikes : {type : Number, default : 0},
    usersLiked : {type : [String]},
    usersDisliked : {type : [String]}
});

postSchema.plugin(mongooseError);


const Post = mongoose.model("Post", postSchema);


module.exports = Post;