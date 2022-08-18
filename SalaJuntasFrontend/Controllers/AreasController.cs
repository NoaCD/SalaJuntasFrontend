using ApiSalaJuntas.Model.DTOS.Areas;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Servicios;

namespace SalaJuntasFrontend.Controllers
{
    public class AreasController : Controller
    {
        public HttpsLocalService localServiceSSL = new HttpsLocalService();

        private readonly IMapper mapper;
        private readonly IConfiguration _configuration;

        public AreasController(IMapper mapper, IConfiguration configuration)
        {
            this.mapper = mapper;
            _configuration = configuration;
        }

        // GET: AreasController
        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult<List<AreaDTO>>> TodosAreas()
        {
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/areas";

            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                var r = response.StatusCode;
                if (r == System.Net.HttpStatusCode.OK)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    // Above three lines can be replaced with new helper method below
                    // string responseBody = await client.GetStringAsync(uri);
                    var ListAreas = JsonConvert.DeserializeObject<List<AreaDTO>>(responseBody).ToList();
                    return new JsonResult(new { Data = ListAreas });

                }
                //Si nos responde el api not found significa que no encontro una lista de evntos para esa fecha
                return new List<AreaDTO>();
            }
            catch (HttpRequestException e)
            {
                return BadRequest(e.Message);
            }

        }


        // GET: AreasController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        /// <summary>
        /// Nos conectamos con el api para guardar el area
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<RespuestaAreaDTO>> CrearAreaAPI([FromBody] AreaCreacionDTO areaCreacionDTO)
        {
            //Enviar al api la informacion
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/areas";
            try
            {
            
                string jsonArea = JsonConvert.SerializeObject(areaCreacionDTO);
                var content = new StringContent(jsonArea, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var areaRespuestaDTO = JsonConvert.DeserializeObject<RespuestaAreaDTO>(responseBody);
                    return areaRespuestaDTO;
                }
                else
                {
                    return new RespuestaAreaDTO()
                    {
                        mensaje = "No establecio conexion con el api",
                        codigoEstatus = 404,
                        icono = "info",
                    };
                }
            }
            catch (HttpRequestException e)
            {
                return new RespuestaAreaDTO()
                {
                    mensaje = e.Message,
                    icono = "error",
                };

            }

        }

        /// <summary>
        /// Nos conectamos directamente con el API para enviar nuestra edicion al API   
        /// </summary>
        /// <param name="id">ID AREA</param>
        /// <param name="areaCreacionDTO">DTO </param>
        /// <returns></returns>

        [HttpPut]
        public async Task<ActionResult<RespuestaAreaDTO>> EditarArea([FromRoute] int id, [FromBody] AreaCreacionDTO areaCreacionDTO)
        {
            //Enviar al api la informacion
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/areas/" + id;
            try
            {
                string jsonArea = JsonConvert.SerializeObject(areaCreacionDTO);
                var content = new StringContent(jsonArea, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PutAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var areaRespuestaDTO = JsonConvert.DeserializeObject<RespuestaAreaDTO>(responseBody);
                    return areaRespuestaDTO;
                }
                else
                {
                    return new RespuestaAreaDTO()
                    {
                        mensaje = "404",
                        codigoEstatus = 404,
                        icono = "info",
                    };
                }
            }
            catch (HttpRequestException e)
            {
                return new RespuestaAreaDTO()
                {
                    mensaje = e.Message,
                    icono = "error",
                };

            }
        }


        /// <summary>
        /// Funcion para eliminar un area enviamos al API
        /// </summary>
        /// <param name="id">id del area</param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<ActionResult<RespuestaAreaDTO>> Delete(int id)
        {
            HttpClient client = localServiceSSL.VotarSSL();

            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");

            string url = baseAPI + "/api/areas/?id=" + id;
            var response = await client.DeleteAsync(url);
            var r = await response.Content.ReadAsStringAsync();
            if (r != null)
            {
                RespuestaAreaDTO oAreaRespuestaDTO = JsonConvert.DeserializeObject<RespuestaAreaDTO>(r);
                return oAreaRespuestaDTO;
            }
            else
            {
                return
                new RespuestaAreaDTO()
                {
                    icono = "error",
                    codigoEstatus = 404,
                    mensaje = "Fallamos en al conectarnos con el api"
                };
            }

        }
    }
}
