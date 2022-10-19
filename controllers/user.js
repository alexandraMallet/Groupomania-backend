const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;        //regex pour l'email. Normalement pris en charge par le front, mais mieux vaux double sécurité
const validPassword = /^[^\s]{8,}$/;                           //regex pour le password. idem email.
const fs = require("fs");
const { crossOriginResourcePolicy } = require("helmet");
                                                               



exports.signup = (req, res, next) => {
    if (!req.body.email.match(validEmail)) {                                                             //regex évitent d'appeler inutilement la BDD en cas d'erreur de saisie
        return res.status(400).json({ message: "email incorrect" });
    }
    if (!req.body.password.match(validPassword)) {
        return res.status(400).json({ message: "le mot de passe doit contenir au moins 8 caracères" });
    }
    console.log(req.body);
    User.findOne({ email: req.body.email })                                                                  //recherche si l'email correspond déjà à un compte
        .then(user => {
            if (user) {                                                                                      //sécurité : impossible de créer 2 comptes avec le même email
                return res.status(409).json({ message: "impossible de créer un compte avec cet email" });    //le message ne dévoile pas explicitement qu'un compte existe déjà avec cet email
            }
            bcrypt.hash(req.body.password, 10)                                                              // hachage du mot de passe
                .then(hash => {
                    const user = new User({ 
                        email : req.body.email,
                        pseudo : req.body.pseudo,
                        password: hash,
                        avatarUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                    });
                    user.save()                                                                                        // enregistrement du nouvel user dans la BDD, après toutes les vérifications
                        .then(() => res.status(201).json({ message: `nouveau compte créé ! pseudo : ${req.body.pseudo}, email : ${req.body.email}`}))
                        .catch(error => res.status(500).json({ error }));
                })
               .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};






exports.login = (req, res, next) => {
    if (!req.body.email.match(validEmail)) {                                                                //regex évitent appel BDD dans le cas d'erreur de saisie
        return res.status(400).json({ message: "email incorrect" });
    }
    if (!req.body.password.match(validPassword)) {
        return res.status(400).json({ message: "le mot de passe doit contenir au moins 8 caractères" });
    }
    User.findOne({ email: req.body.email })                                                                  //recherche de l'user dans la BDD
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "paire identifiant - mot de passe incorrecte" });      //si l'user n'est pas dans la BDD, le message ne le révèle pas explicitement
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {                                                                                       //gestion erreur password
                            return res.status(401).json({ message: "paire identifiant - mot de passe incorrecte" });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(                                                                         //création et attribution d'un jeton de connextion JSON web token
                                    { userId: user._id },
                                    process.env.SECRET_TOKEN,
                                    { expiresIn: "1000h" }
                                )
                            });
                        }
                    })
                  //  .catch(error => res.status(500).json({ error }));
            }
        })
      //  .catch(error => res.status(500).json({ error }));
};


exports.getOneUser = (req, res, next) => {
    User.findOne({_id : req.params.id}).populate("posts")
    .then((user) => res.status(200).json(user))
    //.catch((error) => res.status(404).json({error}));
};

//TODO lien vers nouvelle image
exports.modifyUser = (req, res, next) => {
    User.findOne({_id : req.params.id})
    .then(user => {
        console.log(req.body);
        if(user._id != req.auth.userId) {                   
            return res.status(403).json({message : "ce compte n'est pas le vôtre, vous ne pouvez pas le modifier"});
        }
        if (req.file) {
            fs.unlink(`images/${user.avatarUrl.split("/images/")[1]}`, () => {
                imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                User.updateOne({_id : req.params.id}, {...req.body})                                     
                .then(() => res.status(200).json({message : "compte modifié"}))
             //   .catch((error) => res.status(500).json({error}));
            })
        } else {
            User.updateOne({_id : req.params.id}, {...req.body})
            .then(() => res.status(200).json({message : "compte modifié"}))
          //  .catch((error) => res.status(500).json({error}));
        }
    })
   // .catch((error) => res.status(400).json({error}));
};


exports.deleteUser = (req, res, next) => {

};





exports.getAllUser = (req, res, next) => {                       //admin

};