
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
        ////Boton Personalizado
        //customButtons: {
        //    //Nombre del boton
        //    evento: {
        //        text: 'Agenda un evento ',
        //        click: function () {
        //            MostraModal()
        //        }
        //    }
        //},

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

            MostrarDetalleEvento();
        },
        //Eventos que se mostraran en el calendario
        //events: [
        //    {
        //        title: "Junta Jefes",
        //        start: "2022-07-19 07:00:00",
        //        end: "2022-07-19 11:00:00",
        //        tStartTime: "07:00:00",
        //        tEndTime: "11:00:00",
        //        departament: "RH",
        //        description: "JUNTA PARA HABLAR CON LOS COMPAÑEROS",



        //    }
        //]

        //events: function (start, end, callback) {
        //    let fInicio = moment(start.start).format('YYYY-MM-DD HH:mm:ss');
        //    let fFin = moment(start.end).format('YYYY-MM-DD HH:mm:ss');
        //    $.ajax({
        //        method: "GET",
        //        dataType: "JSON",
        //        url: "/obtener-eventos/" + fInicio + "/" + fFin,
        //        success: function (response) {
        //            console.log(response);
        //            response.map(r => {
        //                //Obtenemos el array de objetos tenemos que gardarlos uno a uno
        //                GuardarEvento(r);

        //            })


        //            console.log(calendar.getEvents());

        //        },
        //        error: function (err) {
        //            alert("erro Conectar API - " + err)
        //        }


        //    });

        //}
        //events: [{
        //    url: "/obtener-eventos/",
        //    error: function (objError) {
        //        alert("Error");
        //    }
        //}],
        eventSources: [
            // your event source
            {
                url: '/obtener-eventos/',
                method: 'GET',
                extraParams: {
                    idAreaMostrar: 1,
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

    ///Funcion de prueba para guardar el evento localmente 
    function GuardarEvento(objEvento) {
        calendar.addEvent({
            title: objEvento.title,
            start: objEvento.start,
            end: objEvento.end,
            backgroundColor: objEvento.color,
            description: objEvento.description,
            tStartTime: moment(objEvento.end).format("HH:mm:ss"),
            tEndTime: moment(objEvento.start).format("HH:mm:ss"),


        });
        //calendar.addEvent({
        //    title: objEvento.title,
        //    start: objEvento.start + " " + objEvento.startTime,
        //    end: objEvento.end + " " + objEvento.endTime,
        //    backgroundColor: objEvento.color,
        //    description: objEvento.description,
        //    tStartTime: objEvento.startTime,
        //    tEndTime: objEvento.endTime

        //});
        console.log(calendar.getEvents());

    }



});


function EnviarEvento(evento) {

    //Adaptar el event para el controlador

    var eventoDTO =
    {
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
