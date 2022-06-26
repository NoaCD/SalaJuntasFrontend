/*
 * Las fecha internamente las maneja asi
 * "2022-06-17T09:00:00"
 */
document.addEventListener('DOMContentLoaded', function () {

    var calendarEl = document.getElementById('agenda');

    var calendar = new FullCalendar.Calendar(calendarEl, {
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
                $("#txtStart").val(fechaInicioNuevoEvento).prop('disable', true);
                $("#tHoraInicio").val(horaInicioNuevoEvento).prop('disabled', true);
                MostraModal();

            }
        },
        /**
         * Event click, es una funcion nativa del framework de javascript
         *  
         * @param {any} info
         */
        eventClick: function (info) {
            console.log(info.event);
            //Obtenmos la duracion del evento con la funcion local
            let stringDuration = obtenerDuracionEvento(info.event.start, info.event.end);

            $("#txtShowTitle").html(info.event.title);
            $("#txtShowDescription").html(info.event.extendedProps.description);
            $("#txtShowSubtitle").html(info.event.extendedProps.department);
            $("#txtShowDuration").html("Duracion: " + stringDuration);
            $("#txtShowInLapses").html("<b>De</b> " + info.event.extendedProps.tStartTime + " <b>A</b> " + info.event.extendedProps.tEndTime);
            MostrarDetalleEvento();
        },
        //Eventos que se mostraran en el calendario
        events: [

            {
                title: "Junta Directivos",
                description: "Resolver problemeas internos de la empresa cuando estamos en peligro",
                department: "Alta Direccíon",
                cratedAt: "2022-06-17 06:00",
                start: "2022-06-17 12:30",
                backgroundColor: '#000000',

            },
            {
                title: "Certificaciones reunion",
                description: "Reunion para capacitar a las personas nuevas, y enseñarles a usar los sitemas de seguridad que hay en la empresa",
                department: "Cértificaciones",
                cratedAt: "2022-06-17 6:00",
                start: "2022-06-17 12:30",
                end: "2022-06-17 13:30",
                eventColor: '#93d2ff',
                textColor: "#000000"
            }

        ],

    });
    calendar.render();

    ///Controla el boton de agregar evento BOTON AGREGAR DEL MODAL
    $("#addEvent").click(function () {
        let nuevoEvento = recolectarDatos("POST");
        let resultadoValidacion = validarEvento(nuevoEvento);

        if (resultadoValidacion) {
            GuardarEvento(nuevoEvento);
            CerrarModal();
        } else {
            mostrarAlertToast('Por favor completa todos los campos');
           
        }


    });

    function GuardarEvento(objEvento) {
        calendar.addEvent({
            title: objEvento.title,
            start: objEvento.start + " " + objEvento.startTime,
            end: objEvento.end + " " + objEvento.endTime,
            backgroundColor: objEvento.color,
            description: objEvento.description,
            tStartTime: objEvento.startTime,
            tEndTime: objEvento.endTime

        });
        console.log(calendar.getEvents());

    }


});

