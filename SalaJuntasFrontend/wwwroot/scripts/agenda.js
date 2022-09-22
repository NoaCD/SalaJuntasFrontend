
/*
 * Las fecha internamente las maneja asi
 * "2022-06-17T09:00:00"
 * 
 */
var calendar = "";
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('agenda');

    calendar = new FullCalendar.Calendar(calendarEl, {
        //Cabecera
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,dayGridMonth,timeGridWeek,listWeek'
        },
        //Idioma
        locale: 'es',
        //TimeZone o Hora de la zona
        timeZone: 'America/Merida',
        //Formato 12 hrs para mostar en la tabla 
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        navLinks: true,

        /**
         * Al darle click a una fecha obtenemos los datos de ella
         * si elegimos una fecha con hora nos mostrara la hora en seguida
         * 
         * @param {any} info tiene toda la data de la fecha a elegir
         */
        dateClick: function (info) {
            //Vamos a validar si existe el id del usuario para poder procesarlo
            let authorize = $("#authorize").val();
            if (authorize != false) {
                if (info.allDay == true) {
                    $("#txtStart").val(info.dateStr);
                    MostraModal();
                } else {
                    //alert(moment(calEvent.start).format('h:mm:ss a'));
                    //Tenemos los datos de la fecha seleccionada lo formateamos para nuestro uso
                    let fechaInicioNuevoEvento = (moment(info.dateStr).format("YYYY-MM-D"));
                    let horaInicioNuevoEvento = (moment(info.dateStr).format("HH:mm"));
                    //Los eventos programados terminaran en el mismo dia solo la hora cambiara
                    let fechaFinalNuevoEvento = (moment(info.dateStr).format("YYYY-MM-D"));
                    //Desahibilitamos los inputs para que no lo mueva el usuario
                    $("#txtStart").val(fechaInicioNuevoEvento);
                    $("#tHoraInicio").val(horaInicioNuevoEvento);
                    MostraModal();
                }

            } else {
                mostrarAlertSwal('<i>¡Espera!</i>', '¡Porfavor inicia sesion para realizar tu evento!');
            }

        },
        /**
         * Event click, es una funcion nativa del framework de javascript
         *  
         * @param {any} info
         */
        eventClick: function (info) {
            moment.locale("es");
            let userNameShort = info.event.extendedProps.usuario.primerNombre + " " + info.event.extendedProps.usuario.apellidoPaterno;
            let fechaCreacion = info.event.extendedProps.fechaCreacion;
            console.log(info.event);
            //Obtenmos la duracion del evento con la funcion local
            let stringDuration = obtenerDuracionEvento(info.event.start, info.event.end);
            $("#idEvento").val(info.event.id);
            $("#txtShowDateProgramated").css('background-color', `${info.event.backgroundColor}`);
            $("#txtShowTitle").html(info.event.title);
            $("#txtShowDateProgramated").html(
                `Para el ${moment(info.event.start).format("ll")}`
            );
            $("#txtShowSubtitle").html(info.event.extendedProps.usuario.departamento.nombre);
            $("#txtShowDescription").html(info.event.extendedProps.description);
            $("#txtShowDuration").html();
            if (info.event.extendedProps.fechaModificacion != null && info.event.extendedProps.fechaModificacion != "") {
                $("#txtShowUpdatedAt").html(
                    "Ultima actualizacion " + moment(info.event.extendedProps.fechaModificacion).fromNow()
                );
            } else {
                $("#txtShowUpdatedAt").html(
                    ""
                );
            }
            $("#txtShowInLapses").html(
                "<b>Especificaciones</b><br/><b>De</b> " +
                moment(info.event.extendedProps.tStartTime, "HH:mm").format("HH:mm") + " <b>A</b> " +
                moment(info.event.extendedProps.tEndTime, "HH:mm").format("HH:mm") +
                "<br><b>Duracion:</b> " + stringDuration + "<br>"
                + `Creado el: ${moment(fechaCreacion).format("D")} de ${moment(fechaCreacion).format("MMMM yy")} • <b>${userNameShort}</b>`

            );
            /***
             * 
             * Funcion para evaluar si puede o no modificar el evento
             * **/
            if (esDueñoDelEvento(userNameShort) == false) {
                ocultarBotonModifyCard();
            } else {
                mostrarBotonModifyCard();
            }
            MostrarDetalleEvento();
        },
        eventSources: [
            // your event source
            {
                url: '/obtener-eventos/',
                method: 'GET',
                extraParams: function () { // a function that returns an object
                    return {
                        idAreaMostrar: getAreaSeleccionada()
                    };
                },
                failure: function () {
                    mostrarAlertSwal("No hay conexion con el API", "Contacte con el desarrollador para solucionar este problema, gracias", "", "error");
                    console.log(url);
                }
            }
        ]
    });

    calendar.render();

    ///Controla el boton de agregar evento BOTON AGREGAR DEL MODAL
    $("#addEvent").click(function () {
        let nuevoEvento = recolectarDatos();
        let resultadoValidacion = validarEvento(nuevoEvento);
        if (resultadoValidacion) {
            EnviarEvento(nuevoEvento);
            CerrarModal();
        } else {
            mostrarAlertToast('Por favor completa todos los campos');
        }

    });

});

/**Retornamos el valor del dropdown que esta seleccionado */
function getAreaSeleccionada() {
    var idareas = $("#dropDownAreas").val();
    return idareas
};


function EnviarEvento(evento) {

    //Adaptar el event para el controlador
    var eventoDTO =
    {
        "idArea": evento.idArea,
        "titulo": evento.title,
        "descripcion": evento.description,
        "color": evento.color,
        "inicio": moment(evento.start).format("YYYY-MM-DD") + "T" + evento.startTime + ":00",
        "final": moment(evento.end).format("YYYY-MM-DD") + "T" + evento.endTime + ":00",

    };

    let eventoJSON = JSON.stringify(eventoDTO);

    //Enviar el evento
    console.log(eventoJSON);
    enviarControlador("POST", "/eventos/EnviarEvento", eventoJSON);


}

//Actualizacion asyncrona del calendario
function ActualizarCalendario() {
    calendar.refetchEvents();
}

/*
 * 
 * Boton para lanzar el el evento mostrar modal para editar
 * 
 */
$("#btnModifyCard").click(function () {
    let idEvento = $("#idEvento").val();
    if (idEvento != "") {
        let oEvento = encontrarEvento(idEvento);
        //Cerramos el modal del detalle
        CerrarDetalleEvento();
        //Mostramos el modal a actualizar
        MostraModal();
        //Llenamos el modal para editar con los datos que recibimos
        rellenarFormularioModificacion(oEvento);

        //Ocultamos el boton de guardar y mostramos el de actualizar
        $("#addEvent").prop('disabled', true);
        $("#btnUpdateEvent").css('visibility', 'visible').focus().css('background-color', '#5b418b');



    }
});

//Evento que escucha al boton con id funcion para eliminar un evento
$("#btnDeleteCard").click(function () {
    let idEvento = $("#idEvento").val();
    enviarControlador("DELETE", "/eventos/eliminarEvento?idEvento=" + idEvento);
    CerrarDetalleEvento();

});

//Evento que esucha al boton con id = btnUpdateEvent
$("#btnUpdateEvent").click(function () {
    let idEvento = $("#idEvento").val();

    let oEvento = recolectarDatos();
    let esValido = validarEvento(oEvento);
    if (!esValido) {
        mostrarAlertToast('¡Por favor complete todos los campos!');
    }

    //Adaptar el event para el controlador
    var eventoDTO =
    {
        "idArea": oEvento.idArea,
        "titulo": oEvento.title,
        "descripcion": oEvento.description,
        "color": oEvento.color,
        "inicio": moment(oEvento.start).format("YYYY-MM-DD") + "T" + oEvento.startTime,
        "final": moment(oEvento.end).format("YYYY-MM-DD") + "T" + oEvento.endTime,
    };

    enviarControlador('PUT', '/eventos/ActualizarEvento?idEvento=' + idEvento, JSON.stringify(eventoDTO));

});


/**
 * Tomamos el formulario de creacion y lo rellenamos con el objeto que llegue
 * */
function rellenarFormularioModificacion(oEvento = {}) {

    console.info(JSON.stringify(oEvento));
    let { title, start, id, backgroundColor, extendedProps: { description: description, tStartTime: tStartTime, tEndTime: tEndTime } } = oEvento;
    let fechaInicio = moment(start).format("YYYY-MM-DD");

    //Agregando el titulo al modal 
    $("#tituloModal").html('Actualizando evento');
    $("#txtTitle").val(title);
    $("#txtDescription").val(description);
    $("#txtStart").val(fechaInicio).prop('disabled', false);
    $("#tHoraInicio").val(tStartTime);
    $("#tHoraFin").val(tEndTime);
    $("#txtBackgroundColor").val(backgroundColor);
    $("#idEvento").val(id);
};


/**
 * 
 * @param {any} idEvento
 * Metodo que encuentra un evento por id 
 * y retorna el objeto si lo encuentra sino retorna un alert de no encontrado
 */
function encontrarEvento(idEvento) {
    let eventos = [];
    eventos = calendar.getEvents();
    let oEventoEditar = eventos.find(item => item.id == idEvento);
    if (oEventoEditar != undefined) {
        return oEventoEditar
    }
    alert("No encontre localmente tu evento")
};
