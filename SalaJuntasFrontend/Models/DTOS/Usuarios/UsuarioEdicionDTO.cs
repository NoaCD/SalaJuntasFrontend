using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiSalaJuntas.Model.DTOS.Usuarios
{
    public class UsuarioEdicionDTO
    {
        //Por Default sera con el 3 porque cunado se cree un usuario sera en estado en proceso
        [Required]
        public int idEstatus { get; set; }
        [Required]
        public int idDepartamento { get; set; }

        //El id 4 pertenece al tipo usuario cliente 
        [Required]
        public int idTipoUsuario { get; set; }

        [Required]
        public int idCargo { get; set; }

        public string primerNombre { get; set; }
        [MaxLength(60)]
        public string? segundoNombre { get; set; } = "";
        [Required]
        [MaxLength(60)]
        public string apellidoPaterno { get; set; }
        [MaxLength(60)]
        public string? apellidoMaterno { get; set; } = "";

        [Required]
        public DateTime fechaNacimiento { get; set; }
    }
}
