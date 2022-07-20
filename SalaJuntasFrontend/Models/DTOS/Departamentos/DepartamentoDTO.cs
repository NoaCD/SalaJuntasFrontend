using ApiSalaJuntas.Model.DTOS.Estatus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Departamentos
{
    public class DepartamentoDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public DateTime fechaCreacion { get; set; }
        public EstatusDTO estatus { get; set; }
    }

}
