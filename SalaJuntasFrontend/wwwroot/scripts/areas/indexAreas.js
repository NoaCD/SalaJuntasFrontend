
/* Formatting function for row details - modify as you need */
function format(d) {
    let nombre = d.nombre
    let estatus = d.estatus.nombre;
    let fechaCreacion = moment(d.fechaCreacion).format('lll');
    console.log(d);
    //Retornamos la tabla
    return (
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Nombre :</td>' +
        '<td>' +
        nombre +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<tr>' +
        '<td> Capacidad :</td>' +
        '<td>' +
        d.capacidad + ' personas' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Estatus: </td>' +
        '<td>' +
        estatus +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Fecha Creacion: </td>' +
        '<td>' +
        fechaCreacion +
        '</td>' +
        '</tr>' +
        '</table>'
    );
}
var table;
$(document).ready(function () {
    table = $('#tblAreas').DataTable({
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
                text: '<i class="fa-brands fa-space-awesome"></i>',
                action: () => crearArea()
            },
            {

                text: '<i class="fa-solid fa-arrows-rotate"></i>',
                action: () => actualizarTablaAsyc()
            }

        ],


        ajax: '/Areas/TodosAreas',

        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
            { data: 'nombre' },
            { data: function (data) { return data.capacidad + ' personas' } },

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
                    return `<button class="btn btn-warning" onClick="updateArea(${data.id}, ${data.estatus.id} ,'${data.nombre}', ${data.capacidad})" > <i class="fa-solid fa-pencil"></i></button> <button class="btn btn-danger" onClick= "eliminarArea(${data.id},'${data.nombre}')" > <i class="fa-solid fa-trash-can"></i> </button>`
                }
            },

        ],

    });

    // Add event listener for opening and closing details
    $('#tblAreas tbody').on('click', 'td.dt-control', function () {
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


function cerrarModal() {
    $('#modal').modal('hide');
}
function abrirModal() {
    $('#modal').modal('show');
}

function actualizarTablaAsyc() {
    table.ajax.reload();
}

//Eliminar Usuario
function eliminarArea(idArea, nombre) {
    //Instanciamos nuestra alerta
    const SwalAlert = alertaConfirmada();
    SwalAlert.fire({
        title: `¿Estas seguro de eliminar a ${nombre}?`,
        text: 'Este cambio no podra revertirse',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminalo',
        cancelButtonText: 'Cancelalo',
        reverseButtons: true
    }).then((result) => {

        if (result.isConfirmed) {
            enviarControlador('DELETE', '/areas/delete/' + idArea);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            confirmo = false;
        }

    })

}



/**
 * Actualizar el area metodo, conecta al controlador
 * @param {any} id id del area
 * @param {any} idEstatus estatus actual del area
 * @param {any} nombre nombre del area
 */
async function updateArea(id, idEstatus, nombre, capacidad) {
    let { value: campo } = await Swal.fire({
        title: 'Editar Area',
        input: 'text',
        inputValue: nombre,
        inputLabel: 'Escribe el nuevo departamento a crear',
        inputPlaceholder: 'Aqui el departamento'
    });
    let { value: quantiy } = await Swal.fire({
        title: 'Nueva Capacidad',
        input: 'number',
        inputValue: capacidad,
        inputLabel: 'Si va a editar la cantidada escribala sino solo oprima ok',
        inputPlaceholder: 'Capacidad en numero'
    });

    if (campo && campo.length >= 2 && capacidad != 0) {
        let obUsuario = { nombre: campo, idEstatus: idEstatus, capacidad: quantiy };
        enviarControlador("PUT", "/areas/EditarArea/" + id, JSON.stringify(obUsuario));
    } else {
        mostrarAlertToast("El campo debe tener mas de 1 letra y por lo menos deberia tener una capacidad asignada ", "info");

    }
}

/**
 * 
 * Metodos conecta con el controlador para enviar un departamento y crearlo
 * 
 * */
async function crearArea() {

    let { value: email } = await Swal.fire({
        title: 'Agregar Area',
        input: 'text',
        inputLabel: 'Area a crear',
        inputPlaceholder: 'Escribe el nombre del area'
    });

    let { value: capacidad } = await Swal.fire({
        title: 'Capacidad maxima',
        input: '¿Cuantas personas caben en la sala?',
        input: 'number',
        inputLabel: 'Area a crear',
        inputPlaceholder: 'Define la cantidad en numeros'
    });

    if (email && email.length >= 2 && capacidad != 0) {
        let obUsuario = { nombre: email, capacidad: capacidad };
        enviarControlador("POST", "/areas/CrearAreaAPI", JSON.stringify(obUsuario));
    } else {
        mostrarAlertToast("El campo debe tener mas de 1 letra y por lo menos deberia tener una capacidad asignada ", "info");
    }
}

