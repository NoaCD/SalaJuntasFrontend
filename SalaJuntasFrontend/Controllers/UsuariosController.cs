using ApiSalaJuntas.Model.DTOS;
using ApiSalaJuntas.Model.DTOS.Cargos;
using ApiSalaJuntas.Model.DTOS.Departamentos;
using ApiSalaJuntas.Model.DTOS.Estatus;
using ApiSalaJuntas.Model.DTOS.Usuarios;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Models;
using SalaJuntasFrontend.Models.DTOS.Usuarios;
using SalaJuntasFrontend.Servicios;

namespace SalaJuntasFrontend.Controllers
{
    public class UsuariosController : Controller
    {

        public HttpsLocalService localServiceSSL = new HttpsLocalService();

        private readonly IMapper mapper;
        private readonly IConfiguration _configuration;

        public UsuariosController(IMapper mapper, IConfiguration configuration)
        {
            this.mapper = mapper;
            _configuration = configuration;
        }


        // GET: UsuariosController
        /// <summary>
        /// En la vista se observa la tabla de registro
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// Obtener todos los usuarios
        /// </summary>
        /// <returns></returns>
        public async Task<ActionResult<List<UsuarioDTO>>> TodosUsuarios()
        {
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/usuarios";

            try
            {
                HttpResponseMessage response = await client.GetAsync(url);
                var r = response.StatusCode;
                if (r == System.Net.HttpStatusCode.OK)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    // Above three lines can be replaced with new helper method below
                    // string responseBody = await client.GetStringAsync(uri);
                    var ListaUsuarios = JsonConvert.DeserializeObject<List<UsuarioDTO>>(responseBody).ToList();
                    return new JsonResult(new { Data = ListaUsuarios });

                }
                //Si nos responde el api not found significa que no encontro una lista de evntos para esa fecha
                return new List<UsuarioDTO>();
            }
            catch (HttpRequestException e)
            {
                return BadRequest(e.Message);
            }

        }

        // GET: UsuariosController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: UsuariosController/Create
        public ActionResult Create()
        {
            var UsuarioCrudViewnModel = GetDataCrudUser().Result;

            return View(UsuarioCrudViewnModel.Value);
        }
        /// <summary>
        /// Usuario Creacion
        /// </summary>
        /// <param name="usuarioCreacion"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<UsuarioRespuestaDTO> CrearUsuarioApi([FromBody] UsuarioCreacionDTO usuarioCreacion)
        {
            //Enviar al api la informacion
            HttpClient client = localServiceSSL.VotarSSL();
            var url = _configuration.GetValue<string>("ConnectionStrings:API") + "/api/usuarios";
            try
            {
                string jsonUsuario = JsonConvert.SerializeObject(usuarioCreacion);
                var content = new StringContent(jsonUsuario, System.Text.Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var usuarioRespuestaDTO = JsonConvert.DeserializeObject<UsuarioRespuestaDTO>(responseBody);
                    return usuarioRespuestaDTO;
                }
                else
                {
                    return new UsuarioRespuestaDTO()
                    {
                        mensaje = "404",
                        codigoEstatus = 404,
                        icono = "info",
                    };
                }
            }
            catch (HttpRequestException e)
            {
                return new UsuarioRespuestaDTO()
                {
                    mensaje = e.Message,
                    icono = "error",
                };

            }


        }


        // GET: UsuariosController/Edit/5
        public async Task<ActionResult> Edit(int id)
        {
            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");
            //Hacemos una peticion para obtener todos los datos del usuario
            HttpClient client = localServiceSSL.VotarSSL();
            //URL Usuario GET BY ID
            var url = baseAPI + "/api/usuarios/" + id;
            //URL GET Departamentos
            var url2 = baseAPI + "/api/departamento/obtener-todos";
            //URL TiposUsuarios
            var url3 = baseAPI + "/api/TipoUsuarios";
            var url4 = baseAPI + "/api/Cargos";

            try
            {
                var userString = await client.GetAsync(url);
                var listDepartmento = await client.GetAsync(url2);
                var listaTipoUsuario = await client.GetAsync(url3);
                var listaCargos = await client.GetAsync(url4);

                var r = userString.StatusCode;
                if (r == System.Net.HttpStatusCode.OK)
                {
                    //Usuarios response
                    string UserResponseBody = await userString.Content.ReadAsStringAsync();
                    var userDTO = JsonConvert.DeserializeObject<UsuarioDTO>(UserResponseBody);
                    //Lista de departamentos
                    string ListaDepartamentoResponseBody = await listDepartmento.Content.ReadAsStringAsync();
                    var listDepartamentoDTO = JsonConvert.DeserializeObject<List<DepartamentoDTO>>(ListaDepartamentoResponseBody);
                    //Lista de tiposUsuarios
                    string ListaTipoUsuarioResponseBody = await listaTipoUsuario.Content.ReadAsStringAsync();
                    var listaTiposUsuarioDTO = JsonConvert.DeserializeObject<List<TipoUsuarioDTO>>(ListaTipoUsuarioResponseBody);
                    //Lista cargos
                    string ListaCargosResponseBody = await listaCargos.Content.ReadAsStringAsync();
                    var listCargosDTO = JsonConvert.DeserializeObject<List<CargoDTO>>(ListaCargosResponseBody);


                    var editarUsuarioModel = new UsuarioCRUDViewModel
                    {
                        tiposUsuario = listaTiposUsuarioDTO,
                        cargos = listCargosDTO,
                        departamentos = listDepartamentoDTO,
                        usuario = userDTO,
                        icono = "success",
                        mensaje = "Recuperado correctamente"
                    };
                    return View(editarUsuarioModel);

                    // Above three lines can be replaced with new helper method below
                    // string responseBody = await client.GetStringAsync(uri);

                }
            }
            catch (Exception ex)
            {

            }

            return View();
        }

        private async Task<ActionResult<UsuarioCRUDViewModel>> GetDataCrudUser()
        {

            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");
            //Hacemos una peticion para obtener todos los datos del usuario
            HttpClient client = localServiceSSL.VotarSSL();

            //URL GET Departamentos
            var url2 = baseAPI + "/api/departamento/obtener-todos";
            //URL TiposUsuarios
            var url3 = baseAPI + "/api/TipoUsuarios";
            //URL Cargos
            var url4 = baseAPI + "/api/Cargos";

            try
            {

                var listDepartamento = await client.GetAsync(url2);
                var listaTipoUsuario = await client.GetAsync(url3);
                var listaCargos = await client.GetAsync(url4);

                var requestDepartament = listDepartamento.StatusCode;
                var requestTipoUsuario = listaTipoUsuario.StatusCode;
                var requestCargos = listaCargos.StatusCode;

                if (requestDepartament == System.Net.HttpStatusCode.OK && requestTipoUsuario == System.Net.HttpStatusCode.OK && requestCargos == System.Net.HttpStatusCode.OK)
                {
                    //Lista de departamentos
                    string ListaDepartamentoResponseBody = await listDepartamento.Content.ReadAsStringAsync();
                    var listDepartamentoDTO = JsonConvert.DeserializeObject<List<DepartamentoDTO>>(ListaDepartamentoResponseBody);
                    //Lista de tiposUsuarios
                    string ListaTipoUsuarioResponseBody = await listaTipoUsuario.Content.ReadAsStringAsync();
                    var listaTiposUsuarioDTO = JsonConvert.DeserializeObject<List<TipoUsuarioDTO>>(ListaTipoUsuarioResponseBody);
                    //Lista cargos
                    string ListaCargosResponseBody = await listaCargos.Content.ReadAsStringAsync();
                    var listCargosDTO = JsonConvert.DeserializeObject<List<CargoDTO>>(ListaCargosResponseBody);


                    var usuarioCRUDViewModel = new UsuarioCRUDViewModel
                    {
                        tiposUsuario = listaTiposUsuarioDTO,
                        cargos = listCargosDTO,
                        departamentos = listDepartamentoDTO,
                        usuario = null,
                        icono = "success",
                        mensaje = "Satisfactorio"
                    };
                    return usuarioCRUDViewModel;

                    // Above three lines can be replaced with new helper method below
                    // string responseBody = await client.GetStringAsync(uri);

                }
                else
                {
                    return new UsuarioCRUDViewModel
                    {
                        icono = "error",
                        mensaje = "Fallo un enpoint para solicitar la data"
                    };
                }
            }
            catch (Exception ex)
            {

                return new UsuarioCRUDViewModel
                {
                    icono = "error",
                    mensaje = "Error al intentar elaborar la peticion con el API"
                };
            }



        }

        /// <summary>
        /// Realiza una peticion con el servidor
        /// PUTASYNC para cambiar el estatus (activo,inactivo, proceso)
        /// </summary>
        /// <param name="idUsuario"></param>
        /// <param name="claveEstatus"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<UsuarioRespuestaDTO> cambiarEstatus([FromQuery] int idUsuario, string claveEstatus)
        {
            //Hacemos una peticion para obtener todos los estatus, luego comparamos si en el array existe
            HttpClient client = localServiceSSL.VotarSSL();
            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");

            string urlEstatus = "/api/Estatus";

            var response = await client.GetAsync(baseAPI + urlEstatus);
            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var strListaEstatus = response.Content.ReadAsStringAsync();
                var ListaEstatus = JsonConvert.DeserializeObject<List<EstatusDTO>>(strListaEstatus.Result);
                EstatusDTO estatusDTO = ListaEstatus.FirstOrDefault(x => x.clave == claveEstatus);
                if (estatusDTO != null)
                {
                    //Significa que hay el estatus que manda
                    //Hacemos la operacion
                    HttpClient client1 = localServiceSSL.VotarSSL();
                    var content = new StringContent("");//Mandamos un json vacio 
                    string UrlCambiarEstatus = baseAPI + $"/api/usuarios?idUsuario={idUsuario}&idEstatus={estatusDTO.id}";
                    var response1 = await client1.PutAsync(UrlCambiarEstatus, content);
                    if (response1.IsSuccessStatusCode)
                    {
                        var respuesta = response1.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<UsuarioRespuestaDTO>(respuesta.Result);
                    }
                    else
                    {
                        return new UsuarioRespuestaDTO
                        {
                            icono = "info",
                            mensaje = "El servidor rechazo la conexcion",
                            codigoEstatus = 404,

                        };
                    }

                }
                else
                {
                    //No existe el estatus
                    return new UsuarioRespuestaDTO
                    {
                        codigoEstatus = 404,
                        icono = "info",
                        mensaje = "No coincide nigun estatus con el que esta enviando"
                    };
                }
            }
            else
            {
                //Fallo la conexion con el api o recibimos badrequest
                return new UsuarioRespuestaDTO
                {
                    codigoEstatus = 404,
                    icono = "info",
                    mensaje = "El servidor rechazo la conexion"
                };
            }
        }


        [HttpPut]
        /// <summary>
        /// Nos conectamos con el API y guardamos 
        /// </summary>
        /// <param name="usuarioEdicionDTO">DTO NECESARIO PARA REALIZAR LA EDICION</param>
        /// <returns></returns>
        public async Task<UsuarioRespuestaDTO> guardarActualizacionUsuario(int id, [FromBody] UsuarioEdicionDTO usuarioEdicionDTO)
        {
            HttpClient client = localServiceSSL.VotarSSL();
            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");

            var content = new StringContent(JsonConvert.SerializeObject(usuarioEdicionDTO), System.Text.Encoding.UTF8, "application/json");//Mandamos un json vacio 
            string urlUpdateUser = baseAPI + $"/api/usuarios/{id}";
            var response = await client.PutAsync(urlUpdateUser, content);

            if (response.IsSuccessStatusCode)
            {
                var userResponse = await response.Content.ReadAsStringAsync();
                var usuarioRespuestaDTO = JsonConvert.DeserializeObject<UsuarioRespuestaDTO>(userResponse);
                return usuarioRespuestaDTO;
            }
            else
            {
                return new UsuarioRespuestaDTO()
                {
                    codigoEstatus = 404,
                    icono = "error",
                    mensaje = "Rechazo la conexion",

                };
            }

        }

        [HttpPut]
        /// <summary>
        /// Endpoint que se conecta con el API
        /// </summary>
        /// <param name="cambiarContraseniaDTO"></param>
        /// <returns>UsuarioRespuestaDTO</returns>
        public async Task<UsuarioRespuestaDTO> cambiarContrasenia([FromBody] CambiarContraseniaDTO cambiarContraseniaDTO)
        {
            if (cambiarContraseniaDTO.idUsuario != 0 && cambiarContraseniaDTO.password != null)
            {
                HttpClient client = localServiceSSL.VotarSSL();
                var jsonUser = JsonConvert.SerializeObject(cambiarContraseniaDTO);
                var content = new StringContent(jsonUser, System.Text.Encoding.UTF8, "application/json");
                string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");
                string url = baseAPI + "/api/usuarios/cambiar-contrasenia";
                var response = await client.PutAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    var resp = await response.Content.ReadAsStringAsync();
                    var usuarioRespuestaDTO = JsonConvert.DeserializeObject<UsuarioRespuestaDTO>(resp);
                    return usuarioRespuestaDTO;

                }
                else
                {
                    return new UsuarioRespuestaDTO()
                    {
                        codigoEstatus = 400,
                        icono = "error",
                        mensaje = "El api rechazo la conexion",

                    };
                }

            }
            else
            {
                return new UsuarioRespuestaDTO()
                {
                    codigoEstatus = 200,
                    icono = "info",
                    mensaje = "No estas enviando el identificador ni la passowrd",

                };
            }
        }


        // GET: UsuariosController/Delete/5
        /// <summary>
        /// Nos conectamos con el apí para eliminar al usuario
        /// </summary>
        /// <param name="id">id del usuario a eliminar</param>
        /// <returns></returns>

        public async Task<ActionResult<UsuarioRespuestaDTO>> Delete(int id)
        {
            HttpClient client = localServiceSSL.VotarSSL();

            string baseAPI = _configuration.GetValue<string>("ConnectionStrings:API");

            string url = baseAPI + "/api/usuarios/" + id;
            var response = await client.DeleteAsync(url);
            var r = await response.Content.ReadAsStringAsync();
            if (r != null)
            {
                UsuarioRespuestaDTO oUserResponse = JsonConvert.DeserializeObject<UsuarioRespuestaDTO>(r);
                return oUserResponse;
            }
            else
            {
                return 
                new UsuarioRespuestaDTO() {
                    icono = "error",
                    codigoEstatus = 404,
                    mensaje = "Fallamos en al conectarnos con el api"
                };
            }
        }

    }
}
