/**
 * 
 * VISTA EDITAR USUARIO
 * 
 * @param {any} id
 */
function update(id) {
    //$.get(`/usuarios/edit/${id}`).done(function (response) {
    //    $("#modal").modal('show');
    //    $("#modal").html(response);
    //    console.log(response);
    //})
    $.ajax({
        type: "get",
        url: `/usuarios/edit/${id}`,
        success: function (data) {
            $("#modal").html(data);
            console.log(data);
            //Esperamos para que llegue la respuesta
            setTimeout(() => { $("#modal").modal('show') ; }, 100);
        },
        error: function (err) {
            console.log(err);
            mostrarAlertSwal("error", err.mensaje, "", "error");
        }
    });
}

