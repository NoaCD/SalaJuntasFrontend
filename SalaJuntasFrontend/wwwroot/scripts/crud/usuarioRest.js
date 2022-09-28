/**
 * 
 * VISTA EDITAR USUARIO
 * 
 * @param {any} id
 */
let iniciador = async (id) => {
    const data = await getData(id);
    
    $("#modal").html(data);
    $("#modal").modal("show");
}

async function getData(id) {
    const response = fetch(`/usuarios/edit/${id}`)
        .then(x => x.text())
        .catch(error => console.error(error))
    return await response;
}

function update(id) {
    iniciador(id);
}