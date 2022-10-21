const Post = require("../models/Post");
const User = require("../models/User");
// const { unsubscribe } = require("../routes/user");


exports.createPost = (req, res, next) => {
    const post = new Post({
        userId: req.auth.userId,
        text: req.body.text,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        createdAt: `${Date.now()}`
    });
    post.save()
        .then(() => res.status(201).json({ message: `Nouvelle publication : ${post.text}` }))
       // .catch((error) => res.status(400).json({ error }));

    User.findOne({ _id: req.auth.userId })
        .then(user => {
            user.posts.push(`${post._id}`);
            user.save();
        })
       // .catch((error) => res.status(400).json({ error }));
};


exports.getAllPosts = (req, res, next) => {
    Post.find()
    .then((posts) => res.status(200).json({posts}))
    .catch((error) => res.status(404).json({error}));

};


exports.getOnePost = (req, res, next) => {
    Post.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch((error) => res.status(404).json({error}));
};


exports.modifyPost = (req, res, next) => {

};


exports.deletePost = (req, res, next) => {

};