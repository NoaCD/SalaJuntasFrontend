
$(document).ready(function () {
    validarFormulario();
    init();
});

/**
 * 
 * Funcion donde inicia el programa, 
 * El boton de guardar tiene un eventi click que al ejecutarse se active{
 * 
 * 
 * */
function init() {
    $("#guardarUsuario").click(function () {
        if ($("#formCrearUsuario").valid() == true) {
            let jsonUsuario = JSON.stringify(armarObjetoUsuario());
            enviarControlador("POST", "/Usuarios/CrearUsuarioApi", jsonUsuario);

        } else {
            mostrarAlertToast("Llena todos los campos obligatorios!", "info");

        }
    })
}

/**
 * Se aplica JqueryValidate
 * */
function validarFormulario() {
    $("#formCrearUsuario").validate({
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
                minlength: 3
            },
            "apellidoMaterno": {
                minlength: 3
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
            "email": {
                required: true,
                email: true
            },
            "password": {
                required: true,
                minlength: 4
            }
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
                minlength: "Minimo 3 letras"
            },
            "apellidoMaterno": {
                minlength: "Minimo 3 letras"
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
            "email": {
                required: "Este campo es obligatorio",
                email: "Escriba un email valido"
            },
            "password": {
                required: "La contraseña es obligatoria",
                minlength: "Minimo 4 caracteres"
            }

        }
    });

}

