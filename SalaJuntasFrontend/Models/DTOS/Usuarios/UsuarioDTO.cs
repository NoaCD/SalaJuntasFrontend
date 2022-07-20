using ApiSalaJuntas.Model.DTOS.Cargos;
using ApiSalaJuntas.Model.DTOS.Departamentos;
using ApiSalaJuntas.Model.DTOS.Estatus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Usuarios
{
    public class UsuarioDTO
    {
        public int id { get; set; }
        public string primerNombre { get; set; }
        public string? segundoNombre { get; set; } = null;
        public string apellidoPaterno { get; set; }
        public string? apellidoMaterno { get; set; } = null;
        public DateTime fechaNacimiento { get; set; }
        public DateTime fechaCreacion { get; set; }
        public EstatusDTO estatus { get; set; }
        public DepartamentoDTO departamento { get; set; }
        public TipoUsuarioDTO tipoUsuario { get; set; }
        public CargoDTO cargo { get; set; }
    }
}
