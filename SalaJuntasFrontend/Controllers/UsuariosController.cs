using ApiSalaJuntas.Model.DTOS.Usuarios;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Servicios;

namespace SalaJuntasFrontend.Controllers
{
    public class UsuariosController : Controller
    {

        public HttpsLocalService localServiceSSL = new HttpsLocalService();

        private readonly IMapper mapper;

        public UsuariosController(IMapper mapper)
        {
            this.mapper = mapper;
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
            var url = "https://localhost:44365" + "/api/usuarios";

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
            return View();
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
        public ActionResult Edit(int id)
        {
            return View();
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
