const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

// Cadastro de Usuário
router.get("/cadastro", (req, res) => res.render("login/cadastro", {css:"login"}))

router.post("/cadastro", (req, res) => {
    var erros = []
    if (req.body.senha != req.body.senha2) erros.push({ texto: "As senhas são diferentes, tente novamente!" })
    if (erros.length>0) res.render("login/cadastro", { erros: erros })
    else {
        Usuario.findOne({email: req.body.email }).lean().then((usuario) => {
            if (usuario){
                req.flash("error_msg", "Já existe uma conta com este e-mail no nosso sistema")
                req.redirect("/usuarios/cadastro")
            } else {
                const novoUsuario = new Usuario({
                    nome : req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            req.flash("error_msg", "Houve um erro durante o cadastro do usuário")
                            res.redirect("/admin")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso!")
                            res.redirect("/usuarios/login")
                        }).catch((err) => {
                            req.flash("erro_msg", "Houve um erro ao criar o usuário, tente novamente!")
                            res.redirect("/usuarios/cadastro")
                        })
                    })
                })
            }
        }).catch((err) => {
            res.redirect("/usuarios/cadastro")
        })
    }
})

// Login
router.get("/login", (req, res) =>  
    res.render("login/login",{css:"login"}))

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

// Logout
router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})

module.exports = router