
$(document).ready(function () {
    validarFormulario();
    init();
});

/**1
 * 
 * Funcion donde inicia el programa, 
 * El boton de guardar tiene un eventi click que al ejecutarse se active{
 * 
 * 
 * */
function init() {
    $("#actualizarUsuario").click(function () {
        if ($("#formActualizarUsuario").valid() == true) {
            let jsonUsuario = JSON.stringify(armarObjetoActualizacionUsuario());
            let oUsuario = JSON.parse(jsonUsuario);
            enviarControlador("PUT", `/Usuarios/guardarActualizacionUsuario/${oUsuario.id}`, jsonUsuario);
        } else {
            mostrarAlertToast("Llena todos los campos obligatorios!", "info");

        }
        return false;
    })
}

/**
 * Se aplica JqueryValidate
 * */
function validarFormulario() {
    $("#formActualizarUsuario").validate({
        rules: {
            "primerNombre": {
                required: true,
                minlength: 3,
            },
            "segundoNombre": {
                minlength: 3
            },
            "apellidoPaterno": {
                required: true,
                minlength: 2
            },
            "apellidoMaterno": {
                minlength: 2
            },
            "fechaNacimiento": {
                required: true,
            },
            "departamento": {
                required: true,
            },
            "cargo": {
                required: true,
            },
           
        },
        messages: {
            "primerNombre": {
                required: "Este campo es requerido",
                minlength: "Minimo 3 letras"
            },
            "segundoNombre": {
                minlength: "Minimo 3 letras"
            },
            "apellidoPaterno": {
                required: "Este campo es requerido",
                minlength: "Minimo 2 letras"
            },
            "apellidoMaterno": {
                minlength: "Minimo 2 letras"
            },
            "fechaNacimiento": {
                required: "Este campo es requerido",
            },
            "departamento": {
                required: "Seleccione un departamento",
            },
            "cargo": {
                required: "Seleccione un cargo",
            },
         

        }
    });

}

