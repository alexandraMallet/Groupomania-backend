const Post = require("../models/Post");


exports.createPost = (req, res, next) => {
    const post = new Post ({
            userId: req.auth.userId,
            text : req.body.text,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            createdAt: `${Date.now}`
    });
    post.save()
    .then(() => res.status(201).json({message : "publication crée"}))
    .catch((error) => res.status(400).json({error}));
};


exports.getAllPosts = (req, res, next) => {

};


exports.getOnePost = (req, res, next) => {

};


exports.modifyPost = (req, res, next) => {

};


exports.deletePost = (req, res, next) => {

};