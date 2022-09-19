using ApiSalaJuntas.Model.DTOS.Areas;

namespace SalaJuntasFrontend.Models.DTOS.ViewsModel
{
    public class AreasViewModel
    {
        public string estatus { get; set; }
        public List<AreaDTO>? areas { get; set; } = null;
    }
}
