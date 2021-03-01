const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
// Importa um objeto de usuário
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = (passport) => {
    // Define o nome dos campos de autenticação, no html
    passport.use(new localStrategy({ usernameField: "email", passwordField: "senha" }, (email, senha, done) => {
        // Busca no banco se o usuário tem cadastro
        Usuario.findOne({ email: email }).then((usuario) => {
            // Caso não encontre, retorna com uma mensagem
            if (!usuario)  return done(null, false, { message: "Esta conta não existe" })
            // Caso encontre, compara o hash das senhas
            bcrypt.compare(senha, usuario.senha, (err, match) => {
                if (match) return done(null, usuario) //Se senhas coincidirem, retorna os dados do usuário 
                else       return done(null, false, { message: "Senha incorreta" }) //Erro, retorna com uma mensagem
            })
        })
    }))
    //Guarda o Id do usuário no cookie da sessão
    passport.serializeUser((usuario, done) => done(null, usuario.id)) 
    passport.deserializeUser((id, done)    => Usuario.findById(id, (err, usuario) => done(err, usuario))) 
    //Retira a sessão deste usuário
}

