using ApiSalaJuntas.Model.DTOS.Areas;
using ApiSalaJuntas.Model.DTOS.Estatus;
using ApiSalaJuntas.Model.DTOS.Usuarios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Eventos
{
    public class EventoDTO
    {
        public int id { get; set; }
        public string titulo { get; set; }
        public string descripcion { get; set; }
        public string colorEvento { get; set; }
        public DateTime inicio { get; set; }
        public DateTime final { get; set; }
        public DateTime fechaCreacion { get; set; }
        public DateTime? fechaModificacion { get; set; } = null;
        public AreaDTO area { get; set; }
        public EstatusDTO estatus { get; set; }
        public UsuarioDTO usuario { get; set; }

    }
}
