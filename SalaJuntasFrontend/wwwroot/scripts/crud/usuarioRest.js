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


    //fetch(`/usuarios/edit/${id}`).then(function (response) {
    //    // The API call was successful!
    //    let txt = response.text();
    //    return txt;
    //}).then(function (r) {

    //    $("#modal").html(r);
    //    $("#modal").modal('show');
    //    console.log(r);
    //}).catch(function (err) {
    //    // There was an error
    //    console.warn('Something went wrong.', err);
    //});


    //$.get(`/usuarios/edit/${id}`).done(function (response) {
    //    $("#modal").modal('show');
    //    $("#modal").html(response);
    //    console.log(response);
    //})


    //$.ajax({
    //    type: "get",
    //    url: `/usuarios/edit/${id}`,
    //    success: function (data) {
    //        $("#modal").html(data);
    //        $("#modal").modal("show");
    //        console.log(data);
    //    },
    //    error: function (err) {
    //        console.log(err);
    //        mostrarAlertSwal("error", err.mensaje, "", "error");
    //    }
    //});
}

