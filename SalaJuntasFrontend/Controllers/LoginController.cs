using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Models.DTOS.Login;
using SalaJuntasFrontend.Servicios;
using System.Security.Claims;

namespace SalaJuntasFrontend.Controllers
{
    public class LoginController : Controller
    {
        public HttpsLocalService localServiceSSL = new HttpsLocalService();
        private readonly IConfiguration configuration;

        public LoginController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        // GET: LoginController
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Acesso
        /// </summary>
        /// <param name="credenciales"></param>
        /// <returns></returns>
        public async Task<ActionResult> validarUsuario(CredencialesAcceso credenciales)
        {

            if (credenciales.Email != "" && credenciales.Password != "")
            {
                //Hacemos una peticion para logearse
                string domain = configuration.GetValue<string>("ConnectionStrings:API");
                string url = domain + "/api/cuentas/login";

                HttpClient client = localServiceSSL.VotarSSL();

                var jsonCredenciales = JsonConvert.SerializeObject(credenciales);

                var content = new StringContent(jsonCredenciales, System.Text.Encoding.UTF8, "application/json");

                var send = await client.PostAsync(url, content);

                var respuesta = await send.Content.ReadAsStringAsync();

                if (send.IsSuccessStatusCode)
                {
                    //Deserializa

                    var rspToken = JsonConvert.DeserializeObject<RespuestaAutenticacionDTO>(respuesta);

                    var claims = new List<Claim>
                            {
                                new Claim("Token", rspToken.Token),
                                new Claim("UserName", rspToken.UserName),
                                new Claim("TipoUsuario", rspToken.TipoUsuarioPublico),
                                new Claim(ClaimTypes.Role , rspToken.TipoUsuarioClave )
                            };
                    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                    ///Lo dejamos pasar
                    return RedirectToAction("Index", "Agenda");
                }
                else
                {
                    //Llave - Valor
                    ModelState.AddModelError("loginErrors", respuesta);
                    return View("Index");
                }

            }
            return Index();

        }

        // GET: LoginController/Create
        public async Task<IActionResult> Salir()
        {

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return RedirectToAction("Index", "Agenda");
        }



    }
}
