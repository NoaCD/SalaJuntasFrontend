
$(document).ready(function () {
    validarFormulario();
    init();
});

/**
 * 
 * Funcion donde inicia el programa, 
 * 
 * 
 * */
function init() {

    $("#guardarUsuario").click(function () {
        if ($("#formCrearUsuario").valid() == true) {
            console.log(JSON.stringify(armarObjeto()));
        } else {
            mostrarAlertToast("NO", "info");

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

/***
 * Funcion que encapsula el formulario de crear Usuario en un objeto
 * retorna un objeto usuario para ser creado
 * */
function armarObjeto() {
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

