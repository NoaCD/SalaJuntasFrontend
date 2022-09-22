/**
 * URL para enviar un evento
 * @param {any} type
 * @param {any} url
 * @param {any} JSONDATA
 */
function enviarControlador(type, url, JSONDATA) {
    $.ajax({
        type: type,
        url: url,
        data: JSONDATA,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.icono == "success") {
                ActualizarCalendario();
                mostrarAlertSwal("Perfecto", data.mensaje, "", data.icono);
                CerrarModal();
            } else {
                mostrarAlertSwal("Upps!", data.mensaje, "", data.icono);
            }
        },
        error: function (err) {
            console.log(err);
            mostrarAlertSwal("error", err.mensaje, "", "error");
        }
    });
}