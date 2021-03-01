// Alterna o banco para produção ou localhost
if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://LukystarWar:tapibaquigrafo@cluster0.uo02e.mongodb.net/test"}
                                // Banco de testes, senha não precisa ser tratada
}else{
    module.exports = {mongoURI: "mongodb://localhost/coimbra"}
}