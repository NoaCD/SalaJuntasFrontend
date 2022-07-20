using System.ComponentModel.DataAnnotations;

namespace ApiSalaJuntas.Model.DTOS.Departamentos
{
    public class DepartamentoCreacionDTO
    {
        [Required]
        public int idEstatus { get; set; }
        [Required]
        [StringLength(55)]
        public string nombre { get; set; }

    }
}
