
function enviarControlador(url, JSONDATA) {
    $.ajax({
        type: 'post',
        url: url,
        data: JSONDATA,
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data) {
            alert(data);
        }
    });
}