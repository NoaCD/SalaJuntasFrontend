using ApiSalaJuntas.Model.DTOS.Respuestas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Departamentos
{
    public class DepartamentoRespuestaDTO : RespuestaDTO
    {

        public DepartamentoDTO? departamentoDTO { get; set; } = null;

    }
}
