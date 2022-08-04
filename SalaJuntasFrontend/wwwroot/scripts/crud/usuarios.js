
/* Formatting function for row details - modify as you need */
function format(d) {
    let apellidoMaterno = d.apellidoMaterno != null ? d.apellidoMaterno : "";
    let segundoNombre = d.segundoNombre != null ? d.segundoNombre : "";
    let nombreCompleto = `${d.primerNombre} ${segundoNombre} ${d.apellidoPaterno} ${apellidoMaterno}`
    let fechaNacimiento = moment(d.fechaNacimiento).format('ll');
    let departamento = d.departamento.nombre;
    let cargo = d.cargo.nombre;
    let fechaCreacion = moment(d.fechaCreacion).format('LLLL');
    let tipoUsuario = d.tipoUsuario.nombre;
    let edadEnAnios = moment().diff(d.fechaNacimiento, 'years');
    let edadEnDias = moment().diff(d.fechaNacimiento, 'days');
    let añosEnMarte = (edadEnDias / 687); //687 dias año astral en marte
    let edad = edadEnAnios + " años";
    // `d` is the original data object for the row
    return (
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Nombre Completo:</td>' +
        '<td>' +
        nombreCompleto +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Fecha Nacimiento:</td>' +
        '<td>' +
        `<span class="badge bg-primary">${fechaNacimiento}</span> <span class="badge bg-success"> Edad - ${edad}</span> <span class="badge bg-dark"> Edad en Marte - ${Math.trunc(añosEnMarte)} años :)</span>` +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Departamento: </td>' +
        '<td>' +
        departamento +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Cargo:</td>' +
        '<td>' +
        cargo +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Tipo de Usuario:</td>' +
        '<td>' +
        tipoUsuario +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<tr>' +
        '<td>Fecha Creación:</td>' +
        '<td>' +
        fechaCreacion +
        '</td>' +
        '</tr>' +
        '</table>'
    );
}

$(document).ready(function () {
    var table = $('#example').DataTable({
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        responsive: {
            details: false
        },
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        dom: 'Bfrtip',
        buttons: [
            'pdf', 'excel',
            {
                text: '<i class="fa-solid fa-user-plus"></i>',
                action: () => $.get('/usuarios/create').done(function (response) {
                    console.log(response);
                    $('#modal').html(response);
                    $('#modal').modal('show');
                }).fail((error) => alert(`Tiempo agotado el servidor no responde: ${error}`))
            },
            {

                text: '<i class="fa-solid fa-arrows-rotate"></i>',
                action: () => actualizarTablaAsyc()
            }

        ],
        ajax: '/Usuarios/TodosUsuarios',

        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: 'primerNombre' },
            { data: 'apellidoPaterno' },
            {
                //TipoUsuario
                data: function (data) {
                    return data.cargo.nombre;
                }
            },
            {
                data: function (data) {
                    return data.departamento.nombre;
                }
            },
            {
                data: function (data) {
                    let estatus = data.estatus.clave;
                    let colorBand = "";
                    if (estatus == "activo")
                        colorBand = "success";
                    else if (estatus == "inactivo")
                        colorBand = "danger";
                    else if (estatus == "proceso")
                        colorBand = "warning";
                    return `<span class="badge bg-${colorBand}">${data.estatus.nombre}</span>`;
                }
            },
            {
                //fechaCreacion
                data: function (data) {
                    return moment(data.fechaCreacion).fromNow();
                }
            },

            {
                data: function (data) {
                    let btnUnlock = `<a class="btn btn-dark" href="/usuario/block/${data.id}" id="${data.id}" ><i class="fa-solid fa-lock"></i></a>`;
                    if (data.estatus.clave == 'proceso')
                        btnUnlock = `<button class="btn btn-primary" id="${data.id}" ><i class="fa-solid fa-check"></i></button>`;
                    if (data.estatus.clave == 'inactivo')
                        btnUnlock = `<button class="btn btn-success" id="${data.id}" ><i class="fa-solid fa-unlock"></i></button>`;
                    return `<a class="btn btn-warning" onclick="update(${data.id})" ><i class="fa-solid fa-pencil"></i></a> ${btnUnlock} <a class="btn btn-danger" id="${data.id}" ><i class="fa-solid fa-trash"></i></a>`
                }
            },

        ],

    });

    // Add event listener for opening and closing details
    $('#example tbody').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });


    function actualizarTablaAsyc() {
        table.ajax.reload()
    }


});