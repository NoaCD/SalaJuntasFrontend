/**
 * 
 * VISTA EDITAR USUARIO
 * 
 * @param {any} id
 */
function update(id) {
    fetch(`/usuarios/edit/${id}`)
        .then(x =>  x.text())
        .then(
            html => { ($("#modal").html(html), $("#modal").modal("show")) })
        .catch(error => console.error(error))
}

