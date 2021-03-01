const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define uma classe de Usuário
const Usuario = new Schema({
    nome : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    nivel: {
        type: Number,
        default: 0 //Não implementado diferentes tipos de acesso
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("usuarios", Usuario)