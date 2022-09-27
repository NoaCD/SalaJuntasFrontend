
/**
* Metodo para armar un objeto de los datos del formulario
* @param {any} method
*/
function recolectarDatos() {
    nuevoEvento = {
        title: $("#txtTitle").val(),
        description: $("#txtDescription").val(),
        color: $("#txtBackgroundColor").val(),
        start: $("#txtStart").val(),
        end: $("#txtStart").val(),
        startTime: $("#tHoraInicio").val(),
        endTime: $("#tHoraFin").val(),
        idArea: $("#dropDownAreas").val(),
    }
    return nuevoEvento;
}

/**
 * Validamos un objeto a enviar
 * retorna un string o el objeto si esta actualizado
 * string : "incompleto"
 * objeto : eventoOBjeto
 * */
function validarEvento(objetoEvento) {
    //Nos Ahorramos la asignacion de variables locales con la desestructuracion de datos

    //let title = objetoEvento.title;
    //let description = objetoEvento.description;
    //let color = objetoEvento.color;
    //let start = objetoEvento.start;
    //let end = objetoEvento.end;
    //let startTime = objetoEvento.startTime;
    //let endTime = objetoEvento.endTime;

    //Validamos el objeto que llega por parametro por desestructuracion de datos
    let { title, description, start, end, startTime, endTime, idArea } = objetoEvento;

    // start time and end time
    if (title === "" || description === "" || start === "" || end === "" || startTime === "" || endTime === "" || idArea === "") {
        return false;
    } else {
        return true;
    }

}


/**
 * Este metodo comprubea que la hora de inicio siempre sea menor que la hora fin
 * No se debe crear un evento
 * @param {any} horaInicio
 * @param {any} horaFin
 */
function verificarLogicaFechas(horaInicio, horaFin) {

    let startTime = moment(horaInicio,'HH:mm');
    let endTime = moment(horaFin,'HH:mm')

    let esValido = false;
    if (startTime > endTime)
        esValido = false;
    else
        esValido = true;

    return esValido;
}


///Funcion que muestra los datos 
function MostraModal() {
    BorarDatosFormulario();
    $("#evento").modal("show");
}

///Funcion que cierra el modal 
function CerrarModal() {
    $("#evento").modal("hide");
}

///Funcion que muestra un modal con un card 
function MostrarDetalleEvento() {
    $("#mostrarDetalleEvento").modal("show");
}

///Funcion que Cierra  los datos 
function CerrarDetalleEvento() {
    $("#mostrarDetalleEvento").modal("hide");
}

function BorarDatosFormulario() {
    $("#txtTitle").val("");
    $("#txtDescription").val("");
    $("#tHoraFin").val("");
    $("#btnUpdateEvent").css('visibility', 'hidden');
    $("#addEvent").css('visibility', 'visible').prop('disabled', false);

}


/**
 * Esta funcion recibe dos paramtros en formato datetime o hora ( YYYY-MM-D HH:mm )
 * @param {any} dateTimeInicio
 * @param {any} dateTimeFinal
 * Retorna la resta de horas es decir la duracion entre estas dos horas (Evento)
 */
function obtenerDuracionEvento(dateTimeInicio, dateTimeFinal = "") {
    let stringDuration = "";

    if (dateTimeFinal != null) {


        let horaInicio = moment(dateTimeInicio).format("HH:mm");
        let horaFinal = moment(dateTimeFinal).format("HH:mm");

        // start time and end time
        var startTime = moment(horaInicio, 'HH:mm:ss a');
        var endTime = moment(horaFinal, 'HH:mm:ss a');

        // calculate total duration
        var duration = moment.duration(endTime.diff(startTime));

        // duration in hours
        var hours = parseInt(duration.asHours());

        // duration in minutes
        var minutes = parseInt(duration.asMinutes()) % 60;

        if (hours == 1) {
            stringDuration = (hours + ' horas y ' + minutes + ' minutos.');
        } else if (hours == 0) {
            stringDuration = (hours + ' horas y ' + minutes + ' minutos.');
        } else {
            stringDuration = (hours + ' hora y ' + minutes + ' minutos.');
        }
    } else {

        stringDuration = "No hay hora final valida, por lo que no se puede calcular la duracion"
    }
    return stringDuration;
}


function ocultarBotonModifyCard() {
    $("#btnModifyCard").css('visibility', 'hidden');
    $("#btnDeleteCard").css('visibility', 'hidden');
}

function mostrarBotonModifyCard() {
    $("#btnModifyCard").css('visibility', 'visible');
    $("#btnDeleteCard").css('visibility', 'visible');
}

/**
 * 
 * @param {any} userNameShort
 * userName debe ser la union de primer nombre y primer apellido
 */
function esDueñoDelEvento(userNameOfEvent = "") {
    let esDueño = false
    if ($("#userName").val() == userNameOfEvent) {
        esDueño = true
    }
    return esDueño;
}