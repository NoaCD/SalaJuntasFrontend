/**
 * Peticion asincrona al api
 * VISTA EDITAR USUARIO
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

