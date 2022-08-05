using ApiSalaJuntas.Model.DTOS;
using ApiSalaJuntas.Model.DTOS.Cargos;
using ApiSalaJuntas.Model.DTOS.Departamentos;
using ApiSalaJuntas.Model.DTOS.Usuarios;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Models;
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

        [HttpPost]
        public UsuarioRespuestaDTO CrearUsuarioApi([FromBody] UsuarioCreacionDTO usuarioCreacion)
        {
            //Enviar al api la informacion
            var nombre = usuarioCreacion.primerNombre;
            return new UsuarioRespuestaDTO();

        }


        // POST: UsuariosController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
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

        // POST: UsuariosController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: UsuariosController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: UsuariosController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
