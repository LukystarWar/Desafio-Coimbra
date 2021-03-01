// Carregando modulos
const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const bodyParser = require ("body-parser")
const { Logger } = require("mongodb")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const { stringify } = require("qs")
require("./config/auth")(passport)
const db = require("./config/db")
const admin = require("./routes/admin")
const usuario = require("./routes/usuario")


// Configurações
    // Sessão
    app.use(session({
        secret: 'tapibaquigrafo',
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    // Midleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        if(res.locals.user){res.locals.username = res.locals.user.nome
                            res.locals.isAdmin  = res.locals.user.isAdmin}
        next()
    })
    // Body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    // Handlebars
    app.engine("handlebars", handlebars({defaultLayout: "main"}))
    app.set("view engine", "handlebars")
    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI).then(()=>{
        console.log("Conectado ao MongoDb!");
    }).catch((err)=>{
        console.log("Erro ao se conectar ao Banco: "+err);
    })
    // Public
    app.use(express.static(path.join(__dirname, "public")))

// Rotas

app.get("/", (req,res)=>{ res.render("login/login" ,{css:"login"})})


    app.use("/admin", admin)
    app.use("/usuarios", usuario)
// Outros
const PORT = process.env.PORT || 80
app.listen(PORT, ()=>{
    console.log("Servidor Rodando!");
})
    
