const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Empresa")
require("../models/Contrato")
const Empresa = mongoose.model("empresas")
const Contrato = mongoose.model("contratos")
const { logado } = require("../helpers/logado")

// Página do carrinho
router.get("/", logado, (req, res) => 
    res.render("admin/index"))
// Inicio - Empresa

// Cadastro de Empresa
router.get("/cadastrar/empresa", logado, (req, res) => 
    res.render("admin/empresaCadastrar"))

router.post("/cadastrar/empresa", logado, (req, res) => {
    const novaEmpresa = {

        cnpj: req.body.cnpj,
        razao: req.body.razao,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    }
    new Empresa(novaEmpresa).save().then(() => {
        req.flash("success_msg", "Empresa cadastrada com sucesso!")
        res.redirect("/admin/listar/empresas")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar os dados, tente novamente!")
        res.redirect("/admin/listar/empresas")
    })

})
// Listagem de Empresas
router.get("/listar/empresas", logado, (req, res) => 
    res.render("admin/empresaListar", { js: "empresas", css: "listar" }))
// API
router.get("/api/listar/empresas", logado, (req, res) => {
    Empresa.find().sort({ data: "desc" }).then((empresas) => {
        res.json({ data: empresas })
    })
})
// Edição de Empresa
router.get("/editar/empresa/:id", logado, (req, res) => {
    Empresa.findOne({ _id: req.params.id }).lean().then((empresa) => {
        res.render("admin/empresaEditar", { empresa: empresa })
    })
})
router.post("/editar/empresa", logado, (req, res) => {
    Empresa.findOne({ _id: req.body.id }).then((empresa) => {

        empresa.cnpj = req.body.cnpj,
            empresa.razao = req.body.razao,
            empresa.endereco = req.body.endereco,
            empresa.telefone = req.body.telefone

        empresa.save().then(() => {
            req.flash("success_msg", "Empresa editada com sucesso!")
            res.redirect("/admin/listar/empresas")
        }).catch((err) => {
            req.flash("error_msg", "Algo deu errado, tente novamente!")
            res.redirect("/admin/listar/empresas")
        })
    }).catch((err) => {
        req.flash("error_msg", "Algo deu errado, tente novamente!")
        res.redirect("/admin/listar/empresas")
    })
})

// Exclusão de empresa
router.post("/deletar/empresa", logado, (req, res) => {
    Contrato.find({ contratante: req.body.id }, { contratado: req.body.id }).then((empresas) => {
        if (empresas.length > 0) { //Se houver contratos com esta empresa não deixa deletar
            req.flash("error_msg", "Esta empresa tem contratos ativos")
            res.redirect("/admin/listar/empresas")
        } else {
            Empresa.deleteOne({ _id: req.body.id }).then(() => {
                req.flash("success_msg", "Cadastro de Empresa deletado com sucesso!")
                res.redirect("/admin/listar/empresas")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao deletar o cadastro.")
                res.redirect("/admin/listar/empresas")
            })
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar o cadastro.")
        res.redirect("/admin/listar/empresas")
    })
})
// Fim - Empresa


// Inicio - Contrato

// Cadastro de Contrato
router.get("/cadastrar/contrato", logado, (req, res) => {
    Empresa.find().lean().then((empresas) => {
        res.render("admin/contratoCadastrar", { empresas: empresas, js: "contratoForm" })
    })
})

router.post("/cadastrar/contrato", logado, (req, res) => {
    const novoContrato = {
        contratante: req.body.contratante,
        contratado: req.body.contratado,
        tipo: req.body.tipo,
        vigencia: req.body.vigencia,
        prazoInicio: req.body.inicio,
        prazoFim: req.body.fim,
        carencia: req.body.carencia,
        valor: req.body.valor
    }
    new Contrato(novoContrato).save().then(() => {
        req.flash("success_msg", "Contrato cadastrado com sucesso!")
        res.redirect("/admin/listar/contratos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar os dados, tente novamente!")
        res.redirect("/admin/listar/contratos")
    })
})

//Listagem de Contratos
router.get("/listar/contratos", logado, (req, res) => 
    res.render("admin/contratoListar", { css: "listar" , js: "contratos"}))

// Informações de um contrato
router.get("/listar/contratos/:id", logado, (req, res) => {
    Contrato.findOne({_id: req.params.id}).lean().then((contrato)=>{
        Empresa.findOne({_id: contrato.contratante}).lean().then((contratante)=>{
            Empresa.findOne({_id: contrato.contratado}).lean().then((contratado)=>{
                res.render("admin/contratoInfo", {contrato : contrato, contratado: contratado, contratante: contratante, css: "info"})
            })
        })
    })
})

// API
router.get("/api/listar/contratos", logado, (req, res) => {
    Contrato.find().populate("contratante").populate("contratado").lean().sort({ data: "desc" }).then((contratos) => {
        res.json({ data: contratos })
    })
})
// Edição de Contrato
router.get("/editar/contrato/:id", logado, (req, res) => {
    Contrato.findOne({ _id: req.params.id }).lean().then((contrato) => {
        Empresa.findOne({ _id: contrato.contratante }).lean().then((contratante) => {
            Empresa.findOne({ _id: contrato.contratado }).lean().then((contratado) => {
                Empresa.find().lean().then((empresas) => {
                    res.render("admin/contratoEditar", { contrato: contrato, empresas: empresas, contratante: contratante, contratado: contratado, js: "contratoForm" })
                })
            })
        })
    }).catch((err) => {
        req.flash("error_msg", "Contrato não encontrado!")
        res.redirect("/admin/listar/contratos")
    })
})
router.post("/editar/contrato", logado, (req, res) => {
    Contrato.findOne({ _id: req.body.id }).then((contrato) => {

        contrato.contratante = req.body.contratante,
            contrato.contratado = req.body.contratado,
            contrato.tipo = req.body.tipo,
            contrato.vigencia = req.body.vigencia,
            contrato.prazoInicio = req.body.inicio,
            contrato.prazoFim = req.body.fim,
            contrato.carencia = req.body.carencia,
            contrato.valor = req.body.valor
        contrato.status = req.body.status

        contrato.save().then(() => {
            req.flash("success_msg", "Contrato editado com sucesso!")
            res.redirect("/admin/listar/contratos")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro na edição, tente novamente.")
            res.redirect("/admin/listar/contratos")
        })
    }).catch((err) => {
        req.flash("error_msg", "Opa, alguma coisa deu errado!")
        console.log(err)
        res.redirect("/admin/listar/contratos")
    })
})
// Exclusão de Contrato
router.post("/deletar/contrato", logado, (req, res) => {
    Contrato.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Contrato deletado com sucesso!")
        res.redirect("/admin/listar/contratos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar, tente novamente.")
        res.redirect("/admin/listar/contratos")
    })
})
// Fim - Contrato
module.exports = router