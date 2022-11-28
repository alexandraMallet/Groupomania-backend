const mongoose = require("mongoose");
const mongooseError = require("mongoose-errors");



const postSchema = new mongoose.Schema({
    userId : {type : String, required : true},
    text : {type : String},
    imageUrl : {type : String},
    usersLiked : {type : Number, default : 0},
    createdAt : {type : String, required : true},
    modifiedAt: {type : String},
    modifiedBy: {type: String},
    likes : {type : Number, default : 0},
    usersLiked : {type : [String]},
    user: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]
});

postSchema.plugin(mongooseError);


const Post = mongoose.model("Post", postSchema);


module.exports = Post;