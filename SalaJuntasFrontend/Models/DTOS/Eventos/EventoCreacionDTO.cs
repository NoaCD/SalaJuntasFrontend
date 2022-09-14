using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS
{
    public class EventoCreacionDTO
    {
        public int? idArea { get; set; } = 1;
        public int? idEstatus { get; set; } = 1;
        public int? idUsuario { get; set; } = 0;
        public string titulo { get; set; }
        public string descripcion { get; set; }
        public string color { get; set; }
        public DateTime inicio { get; set; }
        public DateTime final { get; set; }



    }
}
