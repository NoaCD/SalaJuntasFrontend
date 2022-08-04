/**
 * Peticion asincrona al api
 * 
 * @param {any} id
 */
function update(id) {
    $.get(`/usuarios/edit/${id}`).done(function (response) {
        $("#modal").html(response);
        $("#modal").modal('show');
        console.log(response);
    })
}

