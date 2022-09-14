using ApiSalaJuntas.Model.DTOS;
using ApiSalaJuntas.Model.DTOS.Eventos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Models.DTOS.Eventos;
using SalaJuntasFrontend.Servicios;

namespace SalaJuntasFrontend.Controllers
{
    public class EventosController : Controller
    {
        public HttpsLocalService localServiceSSL = new HttpsLocalService();

        private readonly IMapper mapper;
        private readonly IConfiguration _configuration;

        public EventosController(IMapper mapper, IConfiguration configuration)
        {
            this.mapper = mapper;
            _configuration = configuration;
        }

        // GET: EventosController
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="idAreaMostrar"></param>
        /// <returns></returns>
        [HttpGet("obtener-eventos")]
        public async Task<ActionResult<List<EventoViewDTO>>> GetAll([FromQuery] DateTime start, DateTime end, int? idAreaMostrar = 1)
        {
            HttpClient client = localServiceSSL.VotarSSL();

            string domain = _configuration.GetValue<string>("ConnectionStrings:API");
            // Call asynchronous network methods in a try/catch block to handle exceptions.
            string url = $"{domain}/api/eventos?start={start.ToString("yyyy/MM/dd HH:mm:ss")}&end={end.ToString("yyyy/MM/dd HH:mm:ss")}&idAreaMostrar={idAreaMostrar}";

            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                var r = response.StatusCode;
                if (r == System.Net.HttpStatusCode.OK)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    // Above three lines can be replaced with new helper method below
                    // string responseBody = await client.GetStringAsync(uri);
                    var e = JsonConvert.DeserializeObject<List<EventoDTO>>(responseBody).ToList();

                    var eventos = mapper.Map<List<EventoViewDTO>>(e).ToList();

                    return eventos;

                }

                //Si nos responde el api not found significa que no encontro una lista de evntos para esa fecha
                return new List<EventoViewDTO>();

            }
            catch (HttpRequestException e)
            {
                return BadRequest(e.Message);
            }
        }



        /// <summary>
        /// Nos comunicamos con el api para enviar el evento
        /// 
        /// </summary>
        /// <param name="eventoCreacionDTO"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<RespuestaEventoDTO>> EnviarEvento([FromBody]EventoCreacionDTO eventoCreacionDTO)
        {
            string token = "non";
                token = User.Claims.Where(x => x.Type == "Token").FirstOrDefault().Value;

            string url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/eventos";

            if (token == null || token == "non")
            {
                return BadRequest("No se encuentra el token");
            }

            HttpClient client = localServiceSSL.VotarSSL(token);
            var jsonEvent = JsonConvert.SerializeObject(eventoCreacionDTO);


            var content = new StringContent(jsonEvent, System.Text.Encoding.UTF8, "application/json");
            var peticion = await client.PostAsync(url, content);
            try
            {

                var jsonRespuesta = await peticion.Content.ReadAsStringAsync();
                var oRespuesta = JsonConvert.DeserializeObject<RespuestaEventoDTO>(jsonRespuesta);
                return oRespuesta;

            }
            catch (HttpRequestException e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
