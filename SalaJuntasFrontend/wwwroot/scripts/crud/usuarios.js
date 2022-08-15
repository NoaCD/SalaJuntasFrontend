
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
var table;
$(document).ready(function () {
    table = $('#example').DataTable({
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
                    abrirModal();
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
                    let btnUnlock = `<button class="btn btn-dark" onClick="cambiarEstatus(${data.id},'inactivo')" ><i class="fa-solid fa-lock"></i></button>`;
                    if (data.estatus.clave == 'proceso')
                        btnUnlock = `<button class="btn btn-primary" onClick="cambiarEstatus(${data.id},'activo')" ><i class="fa-solid fa-check"></i></button>`;
                    if (data.estatus.clave == 'inactivo')
                        btnUnlock = `<button class="btn btn-success" onClick="cambiarEstatus(${data.id},'activo')" ><i class="fa-solid fa-unlock"></i></button>`;
                    return `<button class="btn btn-warning" onClick="update(${data.id})" ><i class="fa-solid fa-pencil"></i></button> ${btnUnlock} <button class="btn btn-secondary" onClick="cambiarContrasenia(${data.id},\'${data.primerNombre + ' ' + data.apellidoPaterno} \')" ><i class="fa-solid fa-key"></i></button> <button class="btn btn-danger" onClick="eliminarUsuario(${data.id},\'${data.primerNombre + ' ' + data.apellidoPaterno} \')" ><i class="fa-solid fa-trash"></i></button>`
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
function eliminarUsuario(idUsuario, nombre) {
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
            enviarControlador('DELETE', '/usuarios/delete/'+ idUsuario );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            confirmo = false;
        }
       
    })

}

//FUNCION PARA CAMBIAR LA CONTRASEÑA DEL USUARIO
function cambiarContrasenia(idUsuario, nombre) {
    const SwalAlert = alertaConfirmada();

    SwalAlert.fire({
        title: `La contraseña de ${nombre} cambiara`,
        text: 'Este cambio no podra revertirse',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, quiero cambiarla',
        cancelButtonText: 'Cancelalo',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Añada sus nuevas credenciales',
                html: `<input type="password" id="password" class="swal2-input" placeholder="Escribe la nueva contraseña">
  <input type="password" id="passwordConfirm" class="swal2-input" placeholder="Confirma tu cantraseña">`,
                confirmButtonText: 'Actualizar',
                focusConfirm: false,
                preConfirm: () => {
                    const password = Swal.getPopup().querySelector('#password').value
                    const passwordConfirm = Swal.getPopup().querySelector('#passwordConfirm').value
                    if (!passwordConfirm || !password) {
                        Swal.showValidationMessage(`Porfavor introduzca la contraseña`)
                    } else if (password != passwordConfirm) {
                        Swal.showValidationMessage(`La contraseña no coincide, porfavor verifique`)
                    }
                    if (password.length <= 4 && passwordConfirm.length <= 4) {
                        Swal.showValidationMessage(`La contraseña debe tener mas de 4 digitos`)

                    }

                    return { password: password, passwordConfirm: passwordConfirm }
                }
            }).then((result) => {
                //              Swal.fire(`
                //  Password: ${result.value.password}
                //  PasswordConfirm: ${result.value.passwordConfirm}
                //`.trim())
                /*Ya tenemos las nuevas credenciales*/

                let oUsuario = {
                    "idUsuario": idUsuario,
                    "password": result.value.password
                }
                let JSONUsuario = JSON.stringify(oUsuario);

                enviarControlador('PUT', '/usuarios/cambiarContrasenia', JSONUsuario);

            })

        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }

    })
}


///Funcion para cambiar estatus
function cambiarEstatus(idUsuario, nombreEstatus) {
    enviarControlador('PUT', `/usuarios/cambiarEstatus?idUsuario=${idUsuario}&claveEstatus=${nombreEstatus}`);

}

