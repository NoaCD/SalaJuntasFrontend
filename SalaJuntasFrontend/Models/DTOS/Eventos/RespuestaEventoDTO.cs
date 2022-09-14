using ApiSalaJuntas.Model.DTOS.Eventos;
using ApiSalaJuntas.Model.DTOS.Respuestas;

namespace SalaJuntasFrontend.Models.DTOS.Eventos
{
    public class RespuestaEventoDTO : RespuestaDTO
    {
        public EventoDTO evento { get; set; }
    }
}
