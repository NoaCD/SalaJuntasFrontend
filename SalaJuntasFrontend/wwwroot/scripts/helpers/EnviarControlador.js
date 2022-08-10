
function enviarControlador(type, url, JSONDATA) {
    $.ajax({
        type: type,
        url: url,
        data: JSONDATA,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.icono == "success") {
                mostrarAlertSwal("Perfecto", data.mensaje, "", data.icono);
                actualizarTablaAsyc();
                cerrarModal();
            } else {
                mostrarAlertSwal(data.icono, data.mensaje, "", data.icono);
            }
        },
        error: function (err) {
            console.log(err);
            mostrarAlertSwal("error", err.mensaje, "", "error");
        }
    });
}


/***
 * Funcion que encapsula el formulario de crear Usuario en un objeto
 * retorna un objeto usuario para ser creado
 * */
function armarObjetoUsuario() {
    let primerNombre = $("#primerNombre").val();
    let segundoNombre = $("#segundoNombre").val();
    let apellidoPaterno = $("#apellidoPaterno").val();
    let apellidoMaterno = $("#apellidoMaterno").val();
    let fechaNacimiento = $("#fechaNacimiento").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let idDepartamento = $("#departamento").val();
    let idCargo = $("#cargo").val();

    let nuevoUsuario = {
        "idDepartamento": idDepartamento,
        "idCargo": idCargo,
        "email": email,
        "password": password,
        "primerNombre": primerNombre,
        "segundoNombre": segundoNombre,
        "apellidoPaterno": apellidoPaterno,
        "apellidoMaterno": apellidoMaterno,
        "fechaNacimiento": fechaNacimiento
    }
    return nuevoUsuario;
}


/***
 * Funcion que encapsula el formulario de crear Usuario en un objeto
 * retorna un objeto usuario para ser creado
 * */
function armarObjetoActualizacionUsuario() {
    let primerNombre = $("#primerNombre").val();
    let segundoNombre = $("#segundoNombre").val();
    let apellidoPaterno = $("#apellidoPaterno").val();
    let apellidoMaterno = $("#apellidoMaterno").val();
    let fechaNacimiento = $("#fechaNacimiento").val();
    let idDepartamento = $("#departamento").val();
    let idCargo = $("#cargo").val();
    let idEstatus = $("#idEstatus").val();

    let nuevoUsuario = {
        "idDepartamento": idDepartamento,
        "idCargo": idCargo,
        "idEstatus": idEstatus,
        "primerNombre": primerNombre,
        "segundoNombre": segundoNombre,
        "apellidoPaterno": apellidoPaterno,
        "apellidoMaterno": apellidoMaterno,
        "fechaNacimiento": fechaNacimiento
    }
    return nuevoUsuario;
}

