using ApiSalaJuntas.Model.DTOS.Estatus;

namespace ApiSalaJuntas.Model.DTOS.Areas
{
    public class AreaDTO
    {
        public int id { get; set; }
        public int idEstatus { get; set; }
        public string nombre { get; set; }
        public int capacidad { get; set; }
        public EstatusDTO estatus { get; set; }
        public DateTime fechaCreacion { get; set; }
        public DateTime? fechaModificacion { get; set; } = null;


    }
}
