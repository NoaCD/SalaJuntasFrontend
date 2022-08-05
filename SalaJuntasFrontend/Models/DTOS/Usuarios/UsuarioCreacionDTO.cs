using System.ComponentModel.DataAnnotations;

namespace ApiSalaJuntas.Model.DTOS.Usuarios
{
    public class UsuarioCreacionDTO
    {
        //Por Default sera con el 3 porque cunado se cree un usuario sera en estado en proceso
        [Required]
        public int idEstatus { get; set; } = 3;
        [Required]
        public int idDepartamento { get; set; }

        //El id 4 pertenece al tipo usuario cliente 
        [Required]
        public int idTipoUsuario { get; set; } = 4;

        [Required]
        public int idCargo { get; set; }
        [Required]
        [MaxLength(120)]
        public string email { get; set; }
        [Required]
        [MaxLength(300)]
        public string password { get; set; }
        [Required]
        [MaxLength(60)]
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
