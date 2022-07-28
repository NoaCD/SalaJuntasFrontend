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
        `<span class="badge bg-primary">${fechaNacimiento}</span>` +
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
                    let btnUnlock = `<button class="btn btn-dark" id="${data.id}" ><i class="fa-solid fa-lock"></i></button>`;
                    if (data.estatus.clave == 'proceso')
                        btnUnlock = `<button class="btn btn-primary" id="${data.id}" ><i class="fa-solid fa-check"></i></button>`;
                    if (data.estatus.clave == 'inactivo')
                        btnUnlock = `<button class="btn btn-primary" id="${data.id}" ><i class="fa-solid fa-unlock"></i></button>`;

                    return `<button class="btn btn-warning" id="${data.id}" ><i class="fa-solid fa-pencil"></i></button> ${btnUnlock} <button class="btn btn-danger" id="${data.id}" ><i class="fa-solid fa-trash"></i></button>`
                }
            },

        ],


        order: [[1, 'asc']],
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
});