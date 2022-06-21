using Microsoft.AspNetCore.Mvc;

namespace SalaJuntasFrontend.Controllers
{
    public class AgendaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
