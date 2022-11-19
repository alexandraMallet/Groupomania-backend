const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");

exports.createPost = (req, res, next) => {
    const post = new Post({
        userId: req.auth.userId,
        userPseudo: req.body.userPseudo,
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
        .then((posts) => res.status(200).json({ posts }))
        .catch((error) => res.status(404).json({ error }));

};


exports.getOnePost = (req, res, next) => {
    Post.findById(req.params.id)
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
                        modifiedAt: `${Date.now()}`
                    })
                        .then(() => res.status(200).json({ message: "publication modifiée" }))
                        .catch((error) => res.status(400).json({ error }));
                })
            } else {

                Post.updateOne({ _id: req.params.id }, {
                    ...req.body,
                    modifiedAt: `${Date.now()}`
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

exports.likeDislikePost = (req, res, next) => {

    Post.findOne({ _id: req.params.id })                                                             //on cherche la publication dans la BDD
        .then((post) => {
            const user = req.auth.userId;                                                              //on place l'userId connecté dans une constante
            const userLiked = post.usersLiked.find(e => e == user);                                   //on place l'userId cherché dans le tableau des likes dans une constante
            const userDisliked = post.usersDisliked.find(e => e == user);                             //on place l'userId cherché dans le tableau des dislikes dans une constante

            if (!userLiked && !userDisliked) {                                                 //cas où l'user connecté n'a encore ni liké ni disliké la publication
                switch (req.body.like) {
                    case 0:                                                                      // et qu'il reste neutre
                        res.status(404).json({ message: "rien à supprimer" });
                        break;
                    case 1:                                                                       // et qu'il like
                        post.likes += 1;
                        post.usersLiked.push(`${user}`);
                        post.save()
                            .then(() => res.status(201).json({ message: "like ajouté" }))
                            .catch(error => res.status(500).json({ error }));
                        break;
                    case -1:                                                                       // et qu'il dislike
                        post.dislikes += 1;
                        post.usersDisliked.push(`${user}`);
                        post.save()
                            .then(() => res.status(201).json({ message: "dislike ajouté" }))
                            .catch(error => res.status(500).json({error}));
                }
                return;
            }
            if (userLiked) {                                                                          //cas où l'user a déjà liké la publication
                switch (req.body.like) {
                    case 0:                                                                            // et qu'il annule son like sans disliker
                        post.likes -= 1;
                        post.usersLiked = post.usersLiked.filter(e => e != `${user}`);
                        post.save()
                            .then(() => res.status(200).json({ message: "like supprimé" }))
                            .catch(error => res.status(500).json({ error }));
                        break;
                    case 1:                                                                            // et qu'il tente de liker à nouveau
                        res.status(409).json({ message: "like déjà existant" });                       // (cas rendu normalement impossible par la logique du front mais à prévoir tout de même)
                        break;
                    case -1:                                                                               // et qu'il change son like pour un dislike
                        post.dislikes += 1;
                        post.usersDisliked.push(`${user}`);
                        post.save()
                            .then(() => res.status(201).json({ message: "like supprimé et dislike ajouté" }))
                            .catch(error => res.status(500).json({ error }));
                }
                return;
            }

            if (userDisliked) {                                                                           // cas où l'user a déjà disliké la publication
                switch (req.body.like) {
                    case 0:                                                                                 // et qu'il annule son dislike sans liker
                        post.dislikes -= 1;
                        post.usersDisliked = post.usersDisliked.filter(e => e != `${user}`);
                        post.save()
                            .then(() => res.status(200).json({ message: "dislike supprimé" }))
                            .catch(error => res.status(500).json({ error }));
                        break;
                    case 1:                                                                                  // et qu'il change son dislike pour un like
                        post.likes += 1;
                        post.usersLiked.push(`${user}`); 
                        post.save()
                            .then(() => res.status(201).json({ message: "like supprimé et dislike ajouté" }))
                            .catch(error => res.status(500).json({ error }));
                        break;
                    case -1:                                                                                // et qu'il tente de disliker une seconde fois
                        res.status(409).json({ message: "dislike déjà existant" });                          // (même logique que tentative de 2 likes)
                }
            }
        })
        .catch(error => res.status(500).json({ error }));
};