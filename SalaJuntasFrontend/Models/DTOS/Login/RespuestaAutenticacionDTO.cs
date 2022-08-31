namespace SalaJuntasFrontend.Models.DTOS.Login
{

    public class RespuestaAutenticacionDTO
    {
        public string TipoUsuarioClave { get; set; }
        public string TipoUsuarioPublico { get; set; }
        public string UserName { get; set; }
        public string Token { get; set; }
        public DateTime Expiracion { get; set; }
    }

}
