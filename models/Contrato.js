const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define uma classe de Contrato
const Contrato = new Schema({
    contratante: {
        type: Schema.Types.ObjectId,
        ref: "empresas",
        required: true
    },
    contratado: {
        type: Schema.Types.ObjectId,
        ref: "empresas",
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    vigencia: {
        type: String,
        required: true
    },
    prazoInicio: {
        type: String,
        required: true
    },
    prazoFim: {
        type: String,
        required: true
    },
    carencia: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Ativo"
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("contratos", Contrato)