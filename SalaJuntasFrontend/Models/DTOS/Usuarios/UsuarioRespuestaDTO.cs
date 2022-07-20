using ApiSalaJuntas.Model.DTOS.Respuestas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Usuarios
{
    public class UsuarioRespuestaDTO : RespuestaDTO
    {
        public UsuarioDTO? usuario { get; set; } = null;
    }
}
