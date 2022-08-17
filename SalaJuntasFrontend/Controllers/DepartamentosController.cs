using ApiSalaJuntas.Model.DTOS.Departamentos;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Servicios;

namespace SalaJuntasFrontend.Controllers
{
    public class DepartamentosController : Controller
    {

        public HttpsLocalService localServiceSSL = new HttpsLocalService();

        private readonly IMapper mapper;
        private readonly IConfiguration _configuration;

        public DepartamentosController(IMapper mapper, IConfiguration configuration)
        {
            this.mapper = mapper;
            _configuration = configuration;
        }


        // GET: DepartamentosController
        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult<List<DepartamentoDTO>>> TodosDepartamentos()
        {
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/departamento/obtener-todos";
            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                var r = response.StatusCode;
                if (r == System.Net.HttpStatusCode.OK)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    // Above three lines can be replaced with new helper method below
                    // string responseBody = await client.GetStringAsync(uri);
                    var ListaDepartamento = JsonConvert.DeserializeObject<List<DepartamentoDTO>>(responseBody).ToList();
                    return new JsonResult(new { Data = ListaDepartamento });

                }
                //Si nos responde el api not found significa que no encontro una lista de evntos para esa fecha
                return NotFound();
            }
            catch (HttpRequestException e)
            {
                return BadRequest(e.Message);
            }

        }

        /// <summary>
        /// Nos conectamos con el api para guardar el departamento
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<DepartamentoRespuestaDTO>> CrearUsuarioAPI([FromBody] DepartamentoCreacionDTO departamentoCreacionDTO)
        {
            //Enviar al api la informacion
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/departamento";
            try
            {
                string jsonDepartamento = JsonConvert.SerializeObject(departamentoCreacionDTO);
                var content = new StringContent(jsonDepartamento, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var usuarioRespuestaDTO = JsonConvert.DeserializeObject<DepartamentoRespuestaDTO>(responseBody);
                    return usuarioRespuestaDTO;
                }
                else
                {
                    return new DepartamentoRespuestaDTO()
                    {
                        mensaje = "404",
                        codigoEstatus = 404,
                        icono = "info",
                    };
                }
            }
            catch (HttpRequestException e)
            {
                return new DepartamentoRespuestaDTO()
                {
                    mensaje = e.Message,
                    icono = "error",
                };

            }

        }

        /// <summary>
        /// Nos conectamos directamente con el API para enviar nuestra edicion al API   
        /// </summary>
        /// <param name="id">ID DEPARTAMENTO</param>
        /// <param name="departamentoCreacionDTO">DTO de creacion</param>
        /// <returns></returns>

        [HttpPut]
        public async Task<ActionResult<DepartamentoRespuestaDTO>> Edit([FromRoute] int id, [FromBody] DepartamentoCreacionDTO departamentoCreacionDTO)
        {
            //Enviar al api la informacion
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/departamento/" + id;
            try
            {
                string jsonDepartamento = JsonConvert.SerializeObject(departamentoCreacionDTO);
                var content = new StringContent(jsonDepartamento, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PutAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var usuarioRespuestaDTO = JsonConvert.DeserializeObject<DepartamentoRespuestaDTO>(responseBody);
                    return usuarioRespuestaDTO;
                }
                else
                {
                    return new DepartamentoRespuestaDTO()
                    {
                        mensaje = "404",
                        codigoEstatus = 404,
                        icono = "info",
                    };
                }
            }
            catch (HttpRequestException e)
            {
                return new DepartamentoRespuestaDTO()
                {
                    mensaje = e.Message,
                    icono = "error",
                };

            }
        }


        /// <summary>
        /// Funcion para eliminar un departamento enviamos al API
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<ActionResult<DepartamentoRespuestaDTO>> Delete(int id)
        {

            HttpClient client = localServiceSSL.VotarSSL();

            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");

            string url = baseAPI + "/api/departamento/?id=" + id;
            var response = await client.DeleteAsync(url);
            var r = await response.Content.ReadAsStringAsync();
            if (r != null)
            {
                DepartamentoRespuestaDTO oDepartamentoRespuesta = JsonConvert.DeserializeObject<DepartamentoRespuestaDTO>(r);
                return oDepartamentoRespuesta;
            }
            else
            {
                return
                new DepartamentoRespuestaDTO()
                {
                    icono = "error",
                    codigoEstatus = 404,
                    mensaje = "Fallamos en al conectarnos con el api"
                };
            }



        }


    }
}
