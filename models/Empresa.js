const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define uma classe de Empresa
const Empresa = new Schema({
    cnpj: {
        type: String,
        required: true
    },
    razao: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },

    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("empresas", Empresa)