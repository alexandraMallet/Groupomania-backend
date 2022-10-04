const mongoose = require("mongoose");
const mongooseError = require("mongoose-errors");

const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    date: {type: Date, required: true},                    
    imageUrl: {type: String, required: true},
    text: {type: String, required: true},
    usersLiked: {type: [String]}
});


postSchema.plugin(mongooseError);

module.exports = mongoose.model("Post", postSchema);