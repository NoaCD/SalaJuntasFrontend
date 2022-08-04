using ApiSalaJuntas.Model.DTOS;
using ApiSalaJuntas.Model.DTOS.Cargos;
using ApiSalaJuntas.Model.DTOS.Departamentos;
using ApiSalaJuntas.Model.DTOS.Estatus;
using ApiSalaJuntas.Model.DTOS.Usuarios;

namespace SalaJuntasFrontend.Models
{
    public class UsuarioCRUDViewModel
    {
        public List<TipoUsuarioDTO> tiposUsuario { get; set; }
        public List<DepartamentoDTO> departamentos { get; set; }
        public List<CargoDTO> cargos { get; set; }
        public UsuarioDTO usuario { get; set; }
        public string mensaje { get; set; }
        public string icono{ get; set; }


    }
}
