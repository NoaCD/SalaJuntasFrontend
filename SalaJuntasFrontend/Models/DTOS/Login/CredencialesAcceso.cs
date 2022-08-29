using System.ComponentModel.DataAnnotations;

namespace SalaJuntasFrontend.Models.DTOS.Login
{
    public class CredencialesAcceso
    {

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
