$(document).ready(() => {
    var url = "http://localhost/admin/api/listar/empresas"
    // var url = "https://desafio-coimbra.herokuapp.com/admin/api/listar/empresas"
    empresasTable(url)
})

const empresasTable = (url) => {
    $("#empresas").DataTable({
        "ajax": {
            "url": url,
        },
        "columns": [
            { "data": "cnpj" },
            { "data": "razao" },
            { "data": "endereco" },
            { "data": "telefone" },
            {
                sortable: false,
                "render": (data, type, full, meta) => {
                    let id = full._id
                    return '<a href="/admin/editar/empresa/' + id + '"><img class="ico" id="edit" src="/img/edit.png" alt="edit-logo"></a>'
                }
            },
            {
                sortable: false,
                "render": (data, type, full, meta) => {
                    let id = full._id
                    return '<form action="/admin/deletar/empresa" method="post"><input type="hidden" name="id" value="' + id + '"><button type="submit" class="btn-primary"><img class="ico" id="delete" src="/img/delete.png" alt="delete.png"></button></form>'
                }
            }
        ],
        "language": {
            "url": "/js/plugins/pt-br.json"
        }
    })
}