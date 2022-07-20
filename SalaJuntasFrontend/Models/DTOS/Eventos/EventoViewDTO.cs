using ApiSalaJuntas.Model.DTOS.Areas;
using ApiSalaJuntas.Model.DTOS.Estatus;
using ApiSalaJuntas.Model.DTOS.Usuarios;

namespace SalaJuntasFrontend.Models.DTOS.Eventos
{
    public class EventoViewDTO
    {
        //DTO para la vista
        public int id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string backgroundColor { get; set; }
        public UsuarioDTO usuario { get; set; }
        public AreaDTO area { get; set; }
        public EstatusDTO estatus { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        private string startTime;
        public string tStartTime
        {
            get { return startTime = start.ToString("HH:mm:ss"); }


        }
        private string endTime;
        public string tEndTime
        {
            get { return startTime = end.ToString("HH:mm:ss"); }

        }
        public DateTime fechaCreacion { get; set; }
        public DateTime? fechaModificacion { get; set; } = null;


    }
}
