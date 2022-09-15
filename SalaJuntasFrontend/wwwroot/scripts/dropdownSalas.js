/*/*Hacemos una peticion para obtener todas las areas que existen*/
/***
 * Y se lo asignamos al dropdown
 * */

//let peticion = fetch("/Areas/TodosAreas").then(response => response.json())
//    .then(json => json.data).then(data => data.map(sala => $('#dropDownAreas').append($('<option>', {
//        value: sala.id,
//        text: sala.nombre
//    }))))
//    .catch(error => console.error("Error estimado" + error));

let salas = [];


async function fetchGetAreas() {
    const response = fetch("/Areas/TodosAreas")
        .then(response => response.json())
        .then(areas => areas.data)
        .catch(e => console.error("Error estimado" + e));
    return await response;
}

///Funcion para esperar otro hilo de peticion 
let json = async () => {
    const areas = await fetchGetAreas();
    salas = areas;
    salas.map(item => $('#dropDownAreas').append($('<option>', {
        value: item.id,
        text: item.nombre
    })));
    $('#dropDownAreas  option[value=1]').attr('selected', true);
}
json();



/**
 *Cuando cambia el dropdown se ejecuta esta funcion
 */
$('#dropDownAreas').on('change', function () {
 
    ActualizarCalendario();
});
