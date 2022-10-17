const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const validEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;        //regex pour l'email. Normalement pris en charge par le front, mais mieux vaux double sécurité
const validPassword = /^[^\s]{8,}$/;                           //regex pour le password. idem email.



exports.signup = (req, res, next) => {
    if (!req.body.email.match(validEmail)) {                                                             //regex évitent d'appeler inutilement la BDD en cas d'erreur de saisie
        return res.status(400).json({ message: "email incorrect" });
    }
    if (!req.body.password.match(validPassword)) {
        return res.status(400).json({ message: "le mot de passe doit contenir au moins 8 caracères" });
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return (res.status(409).json({ message: "impossible de créer un compte admin avec cet email" }));
            }
        
            Admin.findOne({ email: req.body.email })
                .then(admin => {
                    if (admin) {
                        return (res.status(409).json({ message: "impossible de créer un compte admin avec cet email" }));
                    }
                bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const admin = new Admin({
                                email : req.body.email,
                                password : hash
                            })
                            admin.save()
                            .then(() => res.status(201).json({message : `compte admin créé. email : ${email}, password : ${password}`}))
                            .catch((error) => res.status(500).json({error}));
                        })
                        .catch((error) => res.status(500).json({ error }));
                    })
                .catch ((error) => res.status(500).json({ error }))})
    .catch ((error) => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {

};


exports.modify = (req, res, next) => {

};


exports.delete = (req, res, next) => {

};


exports.getAdmin = (req, res, next) => {

};