const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");

exports.createPost = (req, res, next) => {
    const post = new Post({
        userId: req.auth.userId,
        text: req.body.text,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        createdAt: `${new Date().toLocaleDateString("fr")}`,
    });
    User.findOne({ _id: req.auth.userId })
        .then(user => {
            user.posts.push(`${post._id}`);
            user.save();
        })
    // .catch((error) => res.status(400).json({ error }));

    post.user.push(`${req.auth.userId}`);
    post.save()
        .then(() => res.status(201).json({ message: `Nouvelle publication : ${post.text}` }))


    // .catch((error) => res.status(400).json({ error }));
};


exports.getAllPosts = (req, res, next) => {
    Post.find().populate("user")
        .then((posts) => res.status(200).json({ posts }))
        .catch((error) => res.status(404).json({ error }));

};


exports.getOnePost = (req, res, next) => {
    Post.findById(req.params.id).populate("user")
        .then(post => res.status(200).json(post))
        .catch((error) => res.status(404).json({ error }));
};


exports.modifyPost = (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.userId != req.auth.userId && !req.auth.isAdmin) {
                return res.status(409).json({ message: "Vous n'avez pas les droits pour modifier cette publication." });
            }

            if (req.file) {
                fs.unlink(`images/${post.imageUrl.split("/images/")[1]}`, () => {
                    post.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

                    Post.updateOne({ _id: req.params.id }, {
                        ...req.body,
                        imageUrl: post.imageUrl,
                        modifedBy: req.auth.isAdmin ? 'admin' : post.user[0].pseudo,
                        modifiedAt: `${new Date().toLocaleDateString("fr")}`
                    })
                        .then(() => res.status(200).json({ message: "publication modifiée" }))
                        .catch((error) => res.status(400).json({ error }));
                })
            } else {

                Post.updateOne({ _id: req.params.id }, {
                    ...req.body,
                    modifedBy: req.auth.isAdmin ? 'admin' : post.user[0].pseudo,
                    modifiedAt: `${new Date().toLocaleDateString("fr")}`
                })
                    .then(() => res.status(200).json({ message: "publication modifiée" }))
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};


exports.deletePost = (req, res, next) => {

    Post.findById(req.params.id)
        .then(post => {
            if (post.userId != req.auth.userId && !req.auth.isAdmin) {
                return res.status(409).json({ message: "Vous n'avez pas les droits pour supprimer cette publication." });
            }

            fs.unlink(`images/${post.imageUrl.split("/images/")[1]}`, () => {
                Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "publication supprimée" }))
                    .catch((error) => res.status(400).json({ error }))
            })

        })
        .catch((error) => res.status(500).json({ error }));

};

exports.addOrRemoveLike = (req, res, next) => {

    Post.findOne({ _id: req.params.id })
        .then((post) => {
            const user = req.auth.userId;
            const userLiked = post.usersLiked.find(e => e == user);

            if (!userLiked) {

                post.likes += 1;
                post.usersLiked.push(`${user}`);
                post.save()
                    .then(() => res.status(201).json({ message: "like ajouté" }))
                    .catch(() => res.status(500).json({ message: "erreur serveur - A" }));
            } else {

                if (userLiked) {

                    post.likes -= 1;
                    post.usersLiked = post.usersLiked.filter(e => e != `${user}`);
                    post.save()
                        .then(() => res.status(200).json({ message: "like supprimé" }))
                    // .catch(error => res.status(500).json({ error }));
                }
            }})
        .catch(() => res.status(500).json({ message: "erreur serveur - B" }));
};

