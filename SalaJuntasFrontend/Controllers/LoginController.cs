using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SalaJuntasFrontend.Models.DTOS.Login;

namespace SalaJuntasFrontend.Controllers
{
    public class LoginController : Controller
    {
        // GET: LoginController
        public ActionResult Index()
        {
            return View();
        }

        // GET: LoginController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        public IActionResult validarUsuario(CredencialesAcceso credenciales)
        {
            var email = credenciales.Email.Split('\u002C');
            var password = credenciales.Password;
            return new JsonResult(new { email, password });


        }

        // GET: LoginController/Create
        public ActionResult Create()
        {
            return View();
        }



    }
}
