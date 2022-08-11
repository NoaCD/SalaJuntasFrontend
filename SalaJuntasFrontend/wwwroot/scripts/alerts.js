//Constante alerta tostada

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});


/**
 * MOstramos en patnalla una alerta de tipo SWAL
 * @param {any} title
 * @param {any} text
 * @param {any} footer
 * @param {any} icono
 */
function mostrarAlertSwal(title = "", text = "", footer = "", icono = "info") {
    Swal.fire({
        icon: icono,
        title: title,
        text: text,
        footer: footer
    });
}

/**
 * Al se llamada mostramos en pantalla un alerta
 * @param {any} icon icono de la alerta
 * @param {any} title titulo a la alterta
 */
function mostrarAlertToast(title = "", icon = "info") {
    Toast.fire({
        icon: icon,
        title: title
    })
}


/**
 * Retorna boleano para saber si quiere ejecutar el btn o no
 * @param {any} title titulo
 * @param {any} text texto
 * @param {any} icon icono
 * @param {any} confirmButtonText texto boton confirmacion
 * @param {any} cancelButtonText text boton cancelacion
 */

function alertaConfirmada() {
    //Constante alerta 
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: true
    });

    return swalWithBootstrapButtons;

}