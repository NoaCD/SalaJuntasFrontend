using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Respuestas
{
    public class RespuestaDTO
    {
        public int codigoEstatus { get; set; }
        public string mensaje { get; set; }
        public string icono { get; set; }
        public bool pasoValidacion { get; set; } = false;
    }
}
