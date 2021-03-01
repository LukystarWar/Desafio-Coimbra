$(document).ready(() => {
    var url = "http://localhost/admin/api/listar/contratos"
    // var url = "https://desafio-coimbra.herokuapp.com/admin/api/listar/contratos"
    contratosTable(url)
})

const contratosTable = (url) => {
    $("#contratos").DataTable({
        "ajax": {
            "url": url,
        },
        "order": [[ 1, "desc" ]],
        "columns": [
            { "data": "contratante.razao" },
            { "data": "contratado.razao" },
            { "data": "tipo" },
            { "data": "vigencia" },
            { "data": "prazoInicio" },
            { "data": "prazoFim" },
            { "data": "carencia" },
            { "data": "valor" },
            { "data": "status" },
            {
                sortable: false,
                "render": (data, type, full, meta) => {
                    let id = full._id
                    return '<a href="/admin/listar/contratos/' + id + '"><img class="ico" src="/img/info.png" alt="edit-logo"></a>'
                }
            },
            {
                sortable: false,
                "render": (data, type, full, meta) => {
                    let id = full._id
                    return '<a href="/admin/editar/contrato/' + id + '"><img class="ico" id="edit" src="/img/edit.png" alt="edit-logo"></a>'
                }
            },

            {
                sortable: false,
                "render": (data, type, full, meta) => {
                    let id = full._id
                    return '<form action="/admin/deletar/contrato" method="post"><input type="hidden" name="id" value="' + id + '"><button type="submit" class="btn-primary"><img class="ico" id="delete" src="/img/delete.png" alt="delete.png"></button></form>'
                }
            },
        ],
        "language": {
            "url": "/js/plugins/pt-br.json"
        }
    })
}

