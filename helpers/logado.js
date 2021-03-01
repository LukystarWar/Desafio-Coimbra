module.exports = {
    logado: function(req, res, next){
        // Caso esteja logado, prossiga
        if (req.isAuthenticated()) return next();
        // Caso não esteja logado, direiciona para tela de login, com uma mensagem
        req.flash("error_msg", "Você precisa estar logado!")
        res.redirect("/")
    }
}